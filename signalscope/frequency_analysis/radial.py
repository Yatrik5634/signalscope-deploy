import numpy as np

def azimuthal_average(image: np.ndarray, center=None) -> np.ndarray:
    """
    Calculates the 1D radial profile of a 2D image (like an FFT spectrum).
    It averages all pixels that are at the same distance (radius) from the center.
    
    Inputs:
        image: A 2D numpy array (usually the shifted FFT magnitude spectrum).
        center: The (x, y) pixel coordinates of the center. If None, it uses the exact middle.
        
    Outputs:
        radial_profile: A 1D numpy array representing the average energy at each radius.
    """
    # Create a grid of Y and X coordinates
    y, x = np.indices(image.shape)
    
    # Define the center of the image
    if not center:
        center = np.array([(x.max() - x.min()) / 2.0, (y.max() - y.min()) / 2.0])
        
    # Calculate the distance of each pixel from the center (radius r)
    # Using Pythagoras theorem: r = sqrt((x - cx)^2 + (y - cy)^2)
    r = np.hypot(x - center[0], y - center[1])
    
    # Convert distances to integers so we can group pixels by radius
    r = r.astype(np.int32)
    
    # Sum the pixel values for each radius
    # bincount quickly sums values in 'image' grouped by the indices in 'r'
    tbin = np.bincount(r.ravel(), image.ravel())
    
    # Count how many pixels are at each radius
    nr = np.bincount(r.ravel())
    
    # Calculate the average (Total Sum / Number of pixels)
    radial_profile = tbin / nr
    
    return radial_profile
