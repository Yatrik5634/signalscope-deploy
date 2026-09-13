import cv2
import numpy as np

def estimate_noise_residual(image_path: str) -> np.ndarray:
    """
    Estimates the camera sensor noise (PRNU approximation) by 
    subtracting a denoised version of the image from the original.
    
    Inputs:
        image_path: Path to the image
    Outputs:
        noise_residual: 2D array representing the pure noise pattern.
    """
    # Load in grayscale (noise is mostly structural/luminance)
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        raise ValueError("Could not load image for noise analysis.")
        
    # Convert to float for accurate math
    img_float = img.astype(np.float32)
    
    # Apply a denoising filter (Gaussian blur is a simple approximation)
    # A real physical camera PRNU extraction uses wavelet filters, 
    # but Gaussian is standard for fast forensic approximations.
    denoised = cv2.GaussianBlur(img_float, (3, 3), 0)
    
    # Noise = Original - Denoised
    noise_residual = img_float - denoised
    
    return noise_residual

def extract_noise_features(noise_residual: np.ndarray) -> dict:
    """
    Extracts statistical features from the noise residual.
    Real cameras have consistent, high-variance thermal noise.
    AI images often have mathematically smooth areas (low variance).
    """
    variance = np.var(noise_residual)
    std_dev = np.std(noise_residual)
    
    # If variance is extremely low, it might be heavily AI-smoothed or purely synthetic
    # We cap the score between 0 and 1
    noise_score = min(variance / 100.0, 1.0)
    
    return {
        "variance": float(variance),
        "std_dev": float(std_dev),
        "noise_score": float(noise_score)
    }
