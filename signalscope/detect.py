import argparse
import torch
from PIL import Image
from torchvision import transforms

# Import all our custom SignalScope Modules!
from models.fusion_model import SignalScopeFusionModel
from frequency_analysis.fft import compute_fft
from frequency_analysis.radial import azimuthal_average
from frequency_analysis.features import extract_fft_features
from forensics.noise import estimate_noise_residual, extract_noise_features

def detect_image(image_path, model_path="runs/best_fusion_model.pth"):
    """
    The main Explainable AI detection function.
    It runs the image through all three branches and generates a final report.
    """
    print("\n" + "="*50)
    print("      SignalScope AI Image Detector")
    print("="*50)
    print(f"Analyzing: {image_path}\n")
    
    # ---------------------------------------------------------
    # BRANCH 1: FREQUENCY DOMAIN (FFT)
    # ---------------------------------------------------------
    try:
        spectrum = compute_fft(image_path)
        radial_profile = azimuthal_average(spectrum)
        fft_features = extract_fft_features(spectrum, radial_profile)
        
        fft_tensor = torch.tensor([[
            fft_features["spectral_entropy"],
            fft_features["high_frequency_ratio"],
            fft_features["mid_frequency_ratio"]
        ]], dtype=torch.float32)
        
        # Calculate a pseudo "Frequency Anomaly Score" (0 to 100%)
        # High mid_frequency usually implies AI checkerboard artifacts
        freq_score = min(fft_features["mid_frequency_ratio"] * 500, 100.0) 
    except Exception as e:
        print(f"Error in Frequency Branch: {e}")
        return

    # ---------------------------------------------------------
    # BRANCH 2: CAMERA NOISE FORENSICS (PRNU)
    # ---------------------------------------------------------
    try:
        residual = estimate_noise_residual(image_path)
        noise_features = extract_noise_features(residual)
        
        # Noise score is inverted: Low variance = high AI probability
        # Real cameras have natural high variance noise.
        ai_noise_prob = max(100.0 - (noise_features['variance']), 0.0)
    except Exception as e:
        print(f"Error in Noise Branch: {e}")
        return

    # ---------------------------------------------------------
    # BRANCH 3: DEEP LEARNING (FUSION CNN)
    # ---------------------------------------------------------
    device = torch.device("cpu") # Keep it simple for CLI detection
    
    # Preprocess image for EfficientNet
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    try:
        img = Image.open(image_path).convert('RGB')
        img_tensor = transform(img).unsqueeze(0) # Add batch dimension
    except Exception as e:
        print(f"Error loading image: {e}")
        return
        
    model = SignalScopeFusionModel(num_classes=3, num_fft_features=3)
    
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
    except Exception:
        print("WARNING: Could not find trained weights. The neural network predictions will be random!")
        
    model.eval()
    
    with torch.no_grad():
        outputs = model(img_tensor, fft_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        
    classes = ["REAL", "AI-GENERATED", "UNCERTAIN"]
    predicted_idx = torch.argmax(probabilities).item()
    final_prediction = classes[predicted_idx]
    confidence = probabilities[predicted_idx].item() * 100

    # ---------------------------------------------------------
    # EXPLAINABLE REPORT
    # ---------------------------------------------------------
    print(f"Prediction      : {final_prediction}")
    print(f"Confidence      : {confidence:.1f}%\n")
    
    print(f"Frequency Score : {freq_score:.1f}% Anomalous (FFT Check)")
    print(f"Noise Score     : {ai_noise_prob:.1f}% Anomalous (PRNU Check)")
    print(f"Spatial Score   : {probabilities[1].item()*100:.1f}% AI (CNN Check)")
    
    print("\nReasoning:")
    
    if freq_score > 60:
        print("- Strong frequency-domain anomaly detected (likely AI upscaling artifacts).")
    else:
        print("- Frequency distribution appears natural.")
        
    if ai_noise_prob > 70:
        print("- Lack of natural camera sensor noise detected (image is unnaturally smooth).")
    else:
        print("- Natural camera noise variance detected (consistent with physical hardware).")
        
    print("="*50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SignalScope AI Image Detector CLI")
    parser.add_argument("--image", type=str, required=True, help="Path to the image to analyze")
    parser.add_argument("--model", type=str, default="runs/best_fusion_model.pth", help="Path to trained weights")
    
    args = parser.parse_args()
    detect_image(args.image, args.model)
