import torch
import torch.nn as nn
from models.efficientnet import FeatureExtractor

class SignalScopeFusionModel(nn.Module):
    """
    The Brain of SignalScope!
    This model fuses (combines) the spatial features from the CNN 
    and the frequency features from the FFT math.
    """
    def __init__(self, num_classes=3, num_fft_features=3, backbone_name="efficientnet_b0"):
        super(SignalScopeFusionModel, self).__init__()
        
        # 1. Spatial Branch (CNN)
        self.spatial_extractor = FeatureExtractor(backbone_name=backbone_name)
        cnn_feature_dim = self.spatial_extractor.feature_dim
        
        # 2. Frequency Branch
        # We just need to know how many numerical FFT stats we are passing in.
        # By default, we have 3 (entropy, high-freq ratio, mid-freq ratio).
        self.num_fft_features = num_fft_features
        
        # We pass the FFT features through a small network so the model can learn 
        # how to interpret them before combining.
        self.fft_encoder = nn.Sequential(
            nn.Linear(num_fft_features, 16),
            nn.ReLU(),
            nn.Linear(16, 32),
            nn.ReLU()
        )
        
        # 3. Fusion Layer
        # We concatenate the CNN features and the encoded FFT features.
        combined_dim = cnn_feature_dim + 32
        
        # 4. Classification Head
        # This makes the final decision (Real, AI, Uncertain)
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(combined_dim, 256),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, image, fft_features):
        """
        Inputs:
            image: A batch of images (Tensor)
            fft_features: A batch of numerical FFT features (Tensor)
            
        Outputs:
            predictions: The raw scores for each class (Tensor)
        """
        # Extract features from the image using the CNN
        spatial_features = self.spatial_extractor(image)
        
        # Encode the mathematical FFT features
        encoded_fft = self.fft_encoder(fft_features)
        
        # Fuse them together (concatenate along the feature dimension)
        # dim=1 means we attach them side-by-side
        fused_features = torch.cat((spatial_features, encoded_fft), dim=1)
        
        # Make the final prediction
        output = self.classifier(fused_features)
        
        return output
