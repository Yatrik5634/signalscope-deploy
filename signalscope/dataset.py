import os
import glob
from PIL import Image
import torch
from torch.utils.data import Dataset
from torchvision import transforms
import numpy as np
import cv2

# Import our FFT math functions!
from frequency_analysis.fft import compute_fft
from frequency_analysis.radial import azimuthal_average
from frequency_analysis.features import extract_fft_features

class SignalScopeDataset(Dataset):
    """
    A custom PyTorch Dataset that loads an image, applies augmentations, 
    and also computes the FFT math simultaneously.
    """
    def __init__(self, data_dir, is_train=True, image_size=224):
        self.data_dir = data_dir
        self.is_train = is_train
        
        # Define our classes mapping
        self.classes = {"real": 0, "ai": 1, "uncertain": 2}
        self.image_paths = []
        self.labels = []
        
        # Scan the directory for images
        for class_name, label in self.classes.items():
            class_dir = os.path.join(data_dir, class_name)
            if os.path.exists(class_dir):
                for img_path in glob.glob(os.path.join(class_dir, "*.*")):
                    if img_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                        self.image_paths.append(img_path)
                        self.labels.append(label)
                        
        print(f"Loaded {len(self.image_paths)} images from {data_dir}")

        # Data Augmentation: To prevent the model from memorizing images.
        if is_train:
            self.transform = transforms.Compose([
                transforms.Resize((image_size + 32, image_size + 32)),
                transforms.RandomCrop((image_size, image_size)),
                transforms.RandomHorizontalFlip(),
                # ColorJitter simulates slight lighting/contrast changes
                transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
                transforms.ToTensor(),
                # Standard ImageNet normalization (required for EfficientNet)
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])
        else:
            # For validation/testing, we just resize and normalize. No random flips!
            self.transform = transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        
        # 1. Load the Image for the CNN
        try:
            image = Image.open(img_path).convert('RGB')
            image_tensor = self.transform(image)
        except Exception as e:
            # If an image is broken, return a dummy tensor (very rare)
            image_tensor = torch.zeros((3, 224, 224))
            
        # 2. Compute the FFT Math
        try:
            spectrum = compute_fft(img_path)
            radial_profile = azimuthal_average(spectrum)
            features = extract_fft_features(spectrum, radial_profile)
            
            # Convert dictionary into a PyTorch tensor
            fft_tensor = torch.tensor([
                features["spectral_entropy"],
                features["high_frequency_ratio"],
                features["mid_frequency_ratio"]
            ], dtype=torch.float32)
        except Exception as e:
            # Fallback if math fails
            fft_tensor = torch.zeros(3, dtype=torch.float32)

        return image_tensor, fft_tensor, torch.tensor(label, dtype=torch.long)
