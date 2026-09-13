import torch
import torch.nn as nn
from torchvision import models

class FeatureExtractor(nn.Module):
    """
    This is the Spatial Branch of our SignalScope architecture.
    We use an EfficientNet backbone (like B0) to extract visual features 
    (textures, edges, shapes) from the image.
    
    Instead of returning a classification (e.g., 'dog' or 'cat'), we remove the 
    final classification layer so it returns an array of numbers (an embedding) 
    that represents the visual features.
    """
    def __init__(self, backbone_name="efficientnet_b0", pretrained=True):
        super(FeatureExtractor, self).__init__()
        
        # Load the base model.
        if backbone_name == "efficientnet_b0":
            # We use weights=DEFAULT if pretrained is True
            weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
            self.backbone = models.efficientnet_b0(weights=weights)
            # The number of features EfficientNet-B0 outputs before classification is 1280
            self.feature_dim = 1280
        elif backbone_name == "efficientnet_b4":
            weights = models.EfficientNet_B4_Weights.DEFAULT if pretrained else None
            self.backbone = models.efficientnet_b4(weights=weights)
            # EfficientNet-B4 outputs 1792 features
            self.feature_dim = 1792
        else:
            raise ValueError(f"Backbone {backbone_name} is not supported yet.")
            
        # We replace the final classifier layer with an Identity layer.
        # This means the model will just pass the raw features through instead 
        # of trying to classify them.
        self.backbone.classifier = nn.Identity()

    def forward(self, x):
        """
        Inputs:
            x: A batch of images [batch_size, channels, height, width]
        Outputs:
            features: Spatial feature vectors [batch_size, feature_dim]
        """
        return self.backbone(x)
