import torch
from models.fusion_model import SignalScopeFusionModel

def test_fusion_architecture():
    print("Testing SignalScope Fusion Architecture...")
    
    # 1. Create a fake batch of images
    # PyTorch images are [batch_size, channels, height, width]
    # Let's pretend we have 2 images in our batch, 3 color channels (RGB), and they are 224x224 pixels.
    batch_size = 2
    dummy_images = torch.randn(batch_size, 3, 224, 224)
    print(f"Created dummy image tensor of shape: {dummy_images.shape}")
    
    # 2. Create a fake batch of FFT features
    # Let's pretend we ran our FFT code and got the 3 numerical stats for each of the 2 images.
    dummy_fft_features = torch.randn(batch_size, 3)
    print(f"Created dummy FFT feature tensor of shape: {dummy_fft_features.shape}")
    
    # 3. Initialize the model
    # We will use 3 classes: [REAL, AI-GENERATED, UNCERTAIN]
    print("\nInitializing SignalScopeFusionModel (using EfficientNet-B0 backbone)...")
    # We set pretrained=False here just so it loads instantly for this test.
    # In training, we will use pretrained=True.
    model = SignalScopeFusionModel(num_classes=3, num_fft_features=3)
    
    # 4. Pass the data through the model
    print("\nPassing data through the Fusion Model...")
    with torch.no_grad(): # We aren't training right now, just testing the forward pass.
        predictions = model(dummy_images, dummy_fft_features)
        
    # 5. Verify the output
    print(f"\nSuccess! Output shape is: {predictions.shape}")
    print(f"Expected shape was: [{batch_size}, 3]")
    
    print("\nRaw Prediction Scores (Logits):")
    print(predictions)
    
    # Convert to probabilities using Softmax to make it readable
    probabilities = torch.nn.functional.softmax(predictions, dim=1)
    print("\nProbabilities (Sum to 100%):")
    print(probabilities)

if __name__ == "__main__":
    test_fusion_architecture()
