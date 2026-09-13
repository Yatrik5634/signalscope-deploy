import numpy as np
from scipy.stats import entropy

def extract_fft_features(magnitude_spectrum: np.ndarray, radial_profile: np.ndarray) -> dict:
    """
    Extracts numerical statistics from the FFT spectrum and radial profile.
    These features can later be fed into a Deep Learning model!
    
    Inputs:
        magnitude_spectrum: 2D FFT image.
        radial_profile: 1D average energy by radius.
        
    Outputs:
        features: A dictionary containing high-frequency ratio, entropy, etc.
    """
    # 1. Calculate Spectral Entropy
    # Entropy measures randomness. AI generated noise often has different randomness than real noise.
    # We must ensure all values are non-negative before creating a probability distribution!
    pos_spectrum = np.clip(magnitude_spectrum, 0, None)
    spectrum_sum = np.sum(pos_spectrum)
    
    if spectrum_sum > 0:
        norm_spectrum = pos_spectrum / spectrum_sum
        # We flatten it to 1D and calculate entropy
        spectral_entropy = entropy(norm_spectrum.flatten())
    else:
        spectral_entropy = 0.0
        
    # 2. High-Frequency Energy Ratio
    # Real images usually have most of their energy in the low frequencies (center).
    # AI models sometimes accidentally put too much energy in the high frequencies (edges).
    # Let's say the last 20% of the radial profile is "high frequency".
    pos_radial = np.clip(radial_profile, 0, None)
    total_energy = np.sum(pos_radial)
    
    high_freq_start = int(len(pos_radial) * 0.8)
    high_freq_energy = np.sum(pos_radial[high_freq_start:])
    
    hf_ratio = high_freq_energy / total_energy if total_energy > 0 else 0
    
    # 3. Mid-Frequency Energy Ratio
    # Often, AI artifacts (like grid-like repeating structures) appear in mid frequencies.
    mid_freq_start = int(len(pos_radial) * 0.3)
    mid_freq_end = int(len(pos_radial) * 0.8)
    mid_freq_energy = np.sum(pos_radial[mid_freq_start:mid_freq_end])
    
    mf_ratio = mid_freq_energy / total_energy if total_energy > 0 else 0
    
    import math
    if math.isnan(spectral_entropy): spectral_entropy = 0.0
    
    return {
        "spectral_entropy": float(spectral_entropy),
        "high_frequency_ratio": float(hf_ratio),
        "mid_frequency_ratio": float(mf_ratio)
    }
