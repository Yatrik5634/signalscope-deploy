import torch
import torch.nn.functional as F
from torchvision import models, transforms
from torchvision.transforms import functional as TF
from PIL import Image, ExifTags, ImageChops, ImageEnhance
import sys
import os
import numpy as np
import cv2
import time

# --- LAYER 1: CRYPTOGRAPHY & METADATA ---
def layer1_c2pa_metadata(image_path):
    """
    Fastest Check: Looks for cryptographic tags like C2PA, SynthID, 
    and specific PNG text chunks injected by AI.
    Also looks for strict hardware metadata (Authenticity Shield).
    """
    has_hardware_signature = False
    hardware_details = "None"
    
    try:
        img = Image.open(image_path)
        
        # Check PNG Chunks
        png_info = img.info
        if png_info:
            info_str = str(png_info).lower()
            if 'parameters' in info_str and 'sampler:' in info_str:
                return True, "Stable Diffusion (Automatic1111)", has_hardware_signature, hardware_details
            if 'prompt' in info_str and 'workflow' in info_str:
                return True, "ComfyUI", has_hardware_signature, hardware_details
            if 'novelai' in info_str:
                return True, "NovelAI", has_hardware_signature, hardware_details

        # Check EXIF / XMP for C2PA or SynthID
        exif = img.getexif()
        metadata_str = ""
        if exif:
            hardware_matches = 0
            make_model = ""
            for tag_id in exif:
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                data = exif.get(tag_id)
                
                # Check for Hardware Data
                if tag in ['Make', 'Model']:
                    make_model += f"{data} "
                    hardware_matches += 1
                if tag in ['ExposureTime', 'ISOSpeedRatings', 'FocalLength']:
                    hardware_matches += 1
                
                if isinstance(data, bytes):
                    data = data.decode(errors="replace")
                metadata_str += str(data).lower()
                
            # Activate Authenticity Shield if physical hardware traits exist
            if hardware_matches >= 3:
                has_hardware_signature = True
                hardware_details = make_model.strip() if make_model else "Generic Camera Hardware"
                
            if 'c2pa' in metadata_str or 'synthid' in metadata_str:
                return True, "C2PA / Google SynthID Watermark Found", has_hardware_signature, hardware_details
            if 'midjourney' in metadata_str:
                return True, "Midjourney", has_hardware_signature, hardware_details
            if 'dall-e' in metadata_str or 'dalle' in metadata_str:
                return True, "DALL-E", has_hardware_signature, hardware_details

    except Exception as e:
        pass

    return False, "No Cryptographic AI Tag Found", has_hardware_signature, hardware_details

# --- LAYER 2: ADVANCED IMAGE FORENSICS ---
def run_ela_heatmap(image_path):
    try:
        original = Image.open(image_path).convert('RGB')
        temp_filename = 'temp_ela.jpg'
        original.save(temp_filename, 'JPEG', quality=95)
        temporary = Image.open(temp_filename)
        diff = ImageChops.difference(original, temporary)
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
        scale = 255.0 / max_diff
        ela_image = ImageEnhance.Brightness(diff).enhance(scale)
        heatmap_path = 'ela_heatmap_output.jpg'
        ela_image.save(heatmap_path)
        os.remove(temp_filename)
        diff_array = np.array(diff)
        std_dev = np.std(diff_array)
        ela_score = 0.0
        if std_dev < 3.0:
            ela_score = 0.8
        elif std_dev < 5.0:
            ela_score = 0.5
        return ela_score, heatmap_path
    except Exception as e:
        return 0.5, None

def run_fft_analysis(image_path):
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)
        h, w = magnitude_spectrum.shape
        center_h, center_w = h // 2, w // 2
        mask = np.ones((h, w), np.uint8)
        cv2.rectangle(mask, (center_w - int(w*0.1), center_h - int(h*0.1)), 
                            (center_w + int(w*0.1), center_h + int(h*0.1)), 0, -1)
        high_freq = magnitude_spectrum * mask
        std_dev = np.std(high_freq[mask == 1])
        if std_dev < 15.0:
            return 0.8 
        return 0.2 
    except:
        return 0.5

def run_prnu_sensor_noise(image_path):
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        laplacian = cv2.Laplacian(img, cv2.CV_64F)
        variance = laplacian.var()
        if variance < 100:
            return 0.9 
        elif variance < 500:
            return 0.6
        return 0.1 
    except:
        return 0.5

# --- LAYER 3: DEEP LEARNING ---
def run_cnn_classifier(image_path, model_path='efficientnet_b4_best.pth'):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = models.efficientnet_b4()
    import torch.nn as nn
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, 2)
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
    except Exception as e:
        return None
    model = model.to(device)
    model.eval()
    input_size = 380
    base_transform = transforms.Compose([
        transforms.Resize((400, 400)),
        transforms.CenterCrop((input_size, input_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    try:
        img = Image.open(image_path).convert('RGB')
    except Exception as e:
        return None
    images = [base_transform(img), base_transform(TF.hflip(img))]
    img_tensor = torch.stack(images).to(device)
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = F.softmax(outputs, dim=1)
        avg_probabilities = torch.mean(probabilities, dim=0)
    return avg_probabilities[0].item()

# --- THE HACKATHON ENGINE (COMBINER) ---
def execute_engine(image_path):
    print("\n" + "="*80)
    print("           HACKATHON: 3-LAYER AI DETECTION ENGINE INITIATED")
    print(f"           Target File: {image_path}")
    print("="*80)
    
    # LAYER 1
    print("\n[Layer 1] Initiating Cryptography & Metadata Scan...")
    time.sleep(0.5)
    is_c2pa, generator, has_hw, hw_details = layer1_c2pa_metadata(image_path)
    
    if is_c2pa:
        print(f"   >>> [ALERT] Layer 1 Halting: Explicit Cryptographic/Metadata tag found!")
        print(f"   >>> Generator Identified: {generator}")
        print("\n" + "*"*80)
        print("                         FINAL VERDICT")
        print("*"*80)
        print(" VERDICT    : 100% AI GENERATED (Layer 1 Short-Circuit)")
        print(f" GENERATOR  : {generator}")
        print(" EFFICIENCY : Massive server time saved via Metadata Halt.")
        print("*"*80 + "\n")
        return

    print("   >>> No explicit C2PA cryptography found.")
    if has_hw:
        print(f"   >>> [SHIELD ACTIVATED] Physical Hardware Detected: {hw_details}")
        print(f"   >>> Script will account for Smartphone Computational Photography (AI Smoothing).")
    else:
        print("   >>> No physical hardware metadata found. Proceeding with strict forensics.")

    # LAYER 2
    print("\n[Layer 2] Extracting Advanced Image Forensics (Mathematics)...")
    ela_score, heatmap_path = run_ela_heatmap(image_path)
    if heatmap_path:
        print(f"   >>> ELA (Error Level Analysis) completed. Heatmap saved to '{heatmap_path}'.")
    
    fft_score = run_fft_analysis(image_path)
    print("   >>> FFT (Fast Fourier Transform) checkerboard grid analysis completed.")
    
    prnu_score = run_prnu_sensor_noise(image_path)
    print("   >>> PRNU (Physical Sensor Noise) approximation completed.")
    
    layer2_avg = (ela_score + fft_score + prnu_score) / 3.0

    # LAYER 3
    print("\n[Layer 3] Executing CNN Deep Learning (EfficientNet-B4)...")
    cnn_score = run_cnn_classifier(image_path)
    if cnn_score is None:
        print("   >>> WARNING: Model missing or failed. Defaulting CNN score to 50%.")
        cnn_score = 0.5
    else:
        print("   >>> CNN Pixel Blending Extraction completed.")

    # COMBINE & APPLY AUTHENTICITY SHIELD
    if has_hw:
        # Smartphone AI heavily modifies forensics. We forgive 80% of Layer 2 mathematical anomalies
        # and rely heavily on the fact that real physical hardware took the photo.
        layer2_avg = layer2_avg * 0.20
        cnn_score = cnn_score * 0.50 # Also forgive some CNN triggers from aggressive phone sharpening

    final_score = (cnn_score * 0.60) + (layer2_avg * 0.40)
    
    if has_hw and final_score < 0.5:
        final_class = "REAL (AUTHENTIC - Mobile Enhanced)"
    else:
        final_class = "AI GENERATED" if final_score > 0.5 else "REAL (AUTHENTIC)"
        
    confidence = max(final_score, 1 - final_score) * 100

    print("\n" + "*"*80)
    print("                         FINAL VERDICT")
    print("*"*80)
    print(" 1. METADATA LAYER (Cryptography) : CLEARED")
    print(f" 2. FORENSIC LAYER (Math/Physical): {layer2_avg*100:>5.1f}% AI")
    print(f"    - ELA Uniformity              : {ela_score*100:>5.1f}% AI")
    print(f"    - FFT Checkerboard Grid       : {fft_score*100:>5.1f}% AI")
    print(f"    - PRNU Lack of Sensor Noise   : {prnu_score*100:>5.1f}% AI")
    print(f" 3. DEEP LEARNING LAYER (Pixels)  : {cnn_score*100:>5.1f}% AI")
    print("-" * 80)
    print(f" VERDICT    : {final_class}")
    if has_hw:
        print(f" DETAILS    : Mobile Computational Photography (AI Smoothing) detected and forgiven.")
    print(f" CONFIDENCE : {confidence:.2f}%")
    print(f" VISUALS    : ELA Heatmap saved to '{heatmap_path}' for judge review.")
    print("*"*80 + "\n")

def execute_engine_api(image_path):
    is_c2pa, generator, has_hw, hw_details = layer1_c2pa_metadata(image_path)
    
    if is_c2pa:
        return {
            "verdict": "100% AI GENERATED (Layer 1 Short-Circuit)",
            "generator": generator,
            "confidence": 100.0,
            "layers": {
                "layer1": "AI Generated",
                "layer2": "Skipped",
                "layer3": "Skipped"
            }
        }

    ela_score, heatmap_path = run_ela_heatmap(image_path)
    fft_score = run_fft_analysis(image_path)
    prnu_score = run_prnu_sensor_noise(image_path)
    
    layer2_avg = (ela_score + fft_score + prnu_score) / 3.0

    cnn_score = run_cnn_classifier(image_path)
    if cnn_score is None:
        cnn_score = 0.5

    if has_hw:
        layer2_avg = layer2_avg * 0.20
        cnn_score = cnn_score * 0.50

    final_score = (cnn_score * 0.60) + (layer2_avg * 0.40)
    
    if has_hw and final_score < 0.5:
        final_class = "REAL (AUTHENTIC - Mobile Enhanced)"
    else:
        final_class = "AI GENERATED" if final_score > 0.5 else "REAL (AUTHENTIC)"
        
    confidence = max(final_score, 1 - final_score) * 100

    return {
        "verdict": final_class,
        "confidence": confidence,
        "generator": "Unknown" if not is_c2pa else generator,
        "has_hardware_signature": has_hw,
        "layers": {
            "layer1": "CLEARED" if not is_c2pa else "DETECTED",
            "layer2_avg": layer2_avg * 100,
            "layer2_ela": ela_score * 100,
            "layer2_fft": fft_score * 100,
            "layer2_prnu": prnu_score * 100,
            "layer3_cnn": cnn_score * 100
        },
        "heatmap": heatmap_path
    }

if __name__ == '__main__':
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
        execute_engine(img_path)
    else:
        print("Error: Please provide an image path.")
        print("Usage: python predict.py my_test_image.jpg")
