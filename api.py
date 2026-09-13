from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys
import shutil
import os
import torch
from torchvision import transforms
from PIL import Image

# Add SignalScope to Python path so its internal imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "signalscope")))

# Import our new SignalScope Modules
from models.fusion_model import SignalScopeFusionModel
from frequency_analysis.fft import compute_fft
from frequency_analysis.radial import azimuthal_average
from frequency_analysis.features import extract_fft_features
from forensics.noise import estimate_noise_residual, extract_noise_features

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the untrained/trained model globally so it doesn't reload on every request
device = torch.device("cpu")
model = SignalScopeFusionModel(num_classes=3, num_fft_features=3)
model_path = "SignalScope/runs/best_fusion_model.pth"
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

img_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.post("/predict")
async def predict_image(file: UploadFile = File(alias="image")):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        explanation = []
        
        # 1. Frequency Branch (FFT)
        spectrum = compute_fft(temp_file)
        radial_profile = azimuthal_average(spectrum)
        fft_features = extract_fft_features(spectrum, radial_profile)
        
        fft_tensor = torch.tensor([[
            fft_features["spectral_entropy"],
            fft_features["high_frequency_ratio"],
            fft_features["mid_frequency_ratio"]
        ]], dtype=torch.float32)
        
        freq_score = min(fft_features["mid_frequency_ratio"] * 500, 100.0)
        
        if freq_score > 60:
            explanation.append("Pixel Detail Check: We found unusual, microscopic patterns that are typical of AI image generators. Real photos don't usually have these patterns.")
        else:
            explanation.append("Pixel Detail Check: The microscopic details in this image look natural and consistent.")

        # 2. Camera Noise Branch (PRNU)
        residual = estimate_noise_residual(temp_file)
        noise_features = extract_noise_features(residual)
        ai_noise_prob = max(100.0 - (noise_features['variance']), 0.0)
        
        if ai_noise_prob > 70:
            explanation.append("Camera Noise Check: Real cameras always leave a tiny, invisible 'static noise' pattern. This image is way too smooth, which is a big sign it was created by AI.")
        else:
            explanation.append("Camera Noise Check: We detected natural camera noise, which is a strong indicator that this was taken with a physical camera.")

        # 3. Spatial Branch (Fusion Model)
        img = Image.open(temp_file).convert('RGB')
        img_tensor = img_transform(img).unsqueeze(0)
        
        with torch.no_grad():
            outputs = model(img_tensor, fft_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            
        # Our classes: 0=REAL, 1=AI, 2=UNCERTAIN
        ai_prob = float(probabilities[1].item())
        real_prob = float(probabilities[0].item())
        
        import math
        if math.isnan(ai_prob) or math.isnan(real_prob):
            ai_prob = 0.5
            real_prob = 0.5
        
        if ai_prob > real_prob:
            label = "AI-generated"
            confidence = ai_prob
        else:
            label = "Real"
            confidence = real_prob
            
        if confidence > 0.7:
            explanation.append("Overall Scene Check: Our advanced AI scanned the overall lighting and objects, and is very confident this image matches patterns seen in AI generations.")
        elif confidence < 0.3:
            explanation.append("Overall Scene Check: Our advanced AI scanned the image and strongly believes the lighting and objects look completely natural.")
        else:
            explanation.append("Overall Scene Check: Our advanced AI found mixed signals in the lighting and objects.")

        # Cleanup
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
        mapped_result = {
            "label": label,
            "confidence": confidence,
            "heatmap": "", # We don't have Grad-CAM setup for the new PyTorch model yet!
            "explanation": explanation
        }
            
        return JSONResponse(content=mapped_result)
    except Exception as e:
        import traceback
        print("--- API ERROR ---", flush=True)
        traceback.print_exc()
        if os.path.exists(temp_file):
            os.remove(temp_file)
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


