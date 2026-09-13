import cv2
import numpy as np
import base64
from PIL import Image, ImageChops, ImageEnhance
import io

def generate_ela_heatmap_base64(image_path: str, quality: int = 90) -> tuple[str, float]:
    """
    Performs Error Level Analysis (ELA) on the image.
    ELA highlights areas that have been modified or have different compression levels,
    which is highly effective at pointing out AI-generated or spliced regions.
    
    Returns a tuple: (Base64 encoded string of the heatmap image, percentage of manipulated pixels).
    """
    try:
        # 1. Open original image
        original = Image.open(image_path).convert('RGB')
        
        # 2. Save it temporarily at a lower quality (this is the core of ELA)
        temp_buffer = io.BytesIO()
        original.save(temp_buffer, 'JPEG', quality=quality)
        temp_buffer.seek(0)
        
        # 3. Read the degraded image back
        degraded = Image.open(temp_buffer).convert('RGB')
        
        # 4. Find the absolute difference between original and degraded
        diff = ImageChops.difference(original, degraded)
        
        # 5. Get the maximum pixel difference and calculate an enhancement factor
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
        scale = 255.0 / max_diff
        
        # 6. Magnify the differences
        enhanced_diff = ImageEnhance.Brightness(diff).enhance(scale)
        
        # 7. Convert to OpenCV format (Numpy array) to apply a cool Heatmap ColorMap
        cv_img = np.array(enhanced_diff)
        cv_img = cv_img[:, :, ::-1].copy() # Convert RGB to BGR for OpenCV
        
        # Convert to grayscale first, then apply color map
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        # Calculate percentage of abnormal pixels (intensity > 50 out of 255)
        abnormal_pixels = np.sum(gray > 50)
        total_pixels = gray.size
        percentage = round((abnormal_pixels / total_pixels) * 100, 2)
        
        # Apply JET colormap (Blue=Low manipulation, Red=High manipulation)
        heatmap = cv2.applyColorMap(gray, cv2.COLORMAP_JET)
        
        # 8. Encode the heatmap as a JPEG in memory
        _, buffer = cv2.imencode('.jpg', heatmap)
        
        # 9. Convert to Base64 string
        base64_str = base64.b64encode(buffer).decode('utf-8')
        
        # Add the data URI prefix for web
        return (f"data:image/jpeg;base64,{base64_str}", percentage)
        
    except Exception as e:
        print(f"Error generating ELA heatmap: {e}")
        return ("", 0.0)
