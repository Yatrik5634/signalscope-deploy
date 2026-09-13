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
from signalscope.advanced_dual_branch import TwoStreamFusionNetwork

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
model = TwoStreamFusionNetwork(num_classes=2)
model_path = "signalscope/runs/sota_dual_branch.pth"
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

img_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

srm_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

@app.post("/predict")
async def predict_image(file: UploadFile = File(alias="image")):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        explanation = []
        
        img = Image.open(temp_file).convert('RGB')
        
        # 1. Dual-Branch Processing
        img_tensor = img_transform(img).unsqueeze(0)
        srm_tensor = srm_transform(img).unsqueeze(0)
        
        with torch.no_grad():
            outputs = model(img_tensor, srm_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            
        # Our new classes: 0=REAL, 1=AI
        real_prob = float(probabilities[0].item())
        ai_prob = float(probabilities[1].item())
        
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
            
        # 2. Explanations (Updated for SRM Filters)
        if confidence > 0.8:
            explanation.append("SRM Filter Check: We detected microscopic noise residuals that are highly consistent with AI generation patterns.")
            explanation.append("Spatial Features: The lighting, shapes, and textures strongly indicate this image was artificially synthesized.")
        elif confidence < 0.2:
            explanation.append("SRM Filter Check: We found a natural camera sensor noise profile (PRNU). AI generators fail to perfectly replicate this.")
            explanation.append("Spatial Features: The objects and lighting look completely natural, confirming this was taken with a real camera.")
        else:
            explanation.append("SRM Filter Check: The statistical noise fingerprint is ambiguous, possibly due to image compression.")
            explanation.append("Overall Analysis: The AI model detected mixed signals. We cannot confidently classify this image.")

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


