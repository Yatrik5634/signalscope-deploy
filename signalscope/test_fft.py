import sys
import matplotlib.pyplot as plt
import cv2
from frequency_analysis.fft import compute_fft
from frequency_analysis.radial import azimuthal_average
from frequency_analysis.features import extract_fft_features

def test_pipeline(image_path):
    print(f"Loading image: {image_path}")
    
    # 1. Compute FFT
    spectrum = compute_fft(image_path)
    print("✓ FFT Computed successfully.")
    
    # 2. Compute Radial Profile
    radial_profile = azimuthal_average(spectrum)
    print("✓ Radial Profile extracted.")
    
    # 3. Extract Features
    features = extract_fft_features(spectrum, radial_profile)
    print("\n--- Extracted Frequency Features ---")
    for key, value in features.items():
        print(f"{key}: {value:.4f}")
    
    # 4. Visualization!
    # Let's show the user what this math actually looks like.
    original_img = cv2.imread(image_path)
    original_img_rgb = cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)
    
    plt.figure(figsize=(15, 5))
    
    # Plot 1: Original Image
    plt.subplot(1, 3, 1)
    plt.imshow(original_img_rgb)
    plt.title("Original Image")
    plt.axis('off')
    
    # Plot 2: FFT Magnitude Spectrum
    plt.subplot(1, 3, 2)
    plt.imshow(spectrum, cmap='magma')
    plt.title("FFT Magnitude Spectrum")
    plt.axis('off')
    
    # Plot 3: 1D Radial Profile
    plt.subplot(1, 3, 3)
    plt.plot(radial_profile, color='blue')
    plt.title("1D Radial Frequency Profile")
    plt.xlabel("Frequency (Radius from center)")
    plt.ylabel("Average Log Magnitude")
    plt.grid(True)
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_fft.py <path_to_image>")
        sys.exit(1)
        
    test_pipeline(sys.argv[1])
