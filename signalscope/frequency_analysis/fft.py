import cv2
import numpy as np

def compute_fft(image_path: str) -> np.ndarray:
    """
    Reads an image and computes its 2D Fast Fourier Transform (FFT).
    
    Inputs:
        image_path: The path to the image file.
    
    Outputs:
        magnitude_spectrum: A 2D numpy array containing the logarithmic 
                            magnitude spectrum of the image frequencies.
    """
    # 1. Load the image safely in grayscale
    # We use grayscale because we care about the structure/texture, not the color right now.
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Error: Could not load image from {image_path}")
    
    # 2. Calculate the 2D Fast Fourier Transform
    # np.fft.fft2 computes the N-dimensional discrete Fourier Transform.
    f = np.fft.fft2(img)
    
    # 3. Shift the zero frequency component to the center
    # By default, the low frequencies are at the corners. We want them in the middle!
    fshift = np.fft.fftshift(f)
    
    # 4. Calculate the magnitude spectrum
    # The FFT returns complex numbers. We take the absolute value (magnitude).
    # We add a small number (1e-8) to avoid taking log(0) which is undefined.
    magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)
    
    return magnitude_spectrum
