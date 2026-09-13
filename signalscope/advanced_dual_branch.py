import os
import glob
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
from tqdm import tqdm
import numpy as np

# ==============================================================================
# 1. SRM Filter Definition
# ==============================================================================
class SRMConv2d(nn.Module):
    """
    Spatial Rich Model (SRM) Filter Layer.
    Extracts high-frequency noise residuals from the image.
    AI generators leave specific statistical traces in the noise domain which
    this filter highlights while suppressing image content (edges, textures).
    """
    def __init__(self, inc=3):
        super(SRMConv2d, self).__init__()
        
        # Define the basic 3x3 SRM high-pass filter weights
        # This acts as a Laplacian-like filter specifically tuned for image forensics
        q = [4.0, 12.0, 2.0]
        filter1 = [[0, 0, 0],
                   [0, 1, -1],
                   [0, 0, 0]]
        filter2 = [[0, 1, 0],
                   [0, -1, 0],
                   [0, 0, 0]]
        filter3 = [[0, 0, 0],
                   [0, 1, 0],
                   [0, 0, -1]]
        
        # Create tensor of shape (3, 1, 3, 3)
        weight = torch.tensor([filter1, filter2, filter3], dtype=torch.float32).unsqueeze(1)
        
        # We want to apply this to all 3 RGB channels (inc = 3).
        # We'll use grouped convolution so each RGB channel gets its own set of 3 filters.
        # Output channels = 3 filters * 3 RGB = 9 channels.
        self.weight = nn.Parameter(weight.repeat(inc, 1, 1, 1), requires_grad=False)
        self.inc = inc
        
    def forward(self, x):
        # Apply the fixed convolution. grouped by input channels.
        # This extracts the noise residual for each RGB channel independently.
        out = F.conv2d(x, self.weight, stride=1, padding=1, groups=self.inc)
        
        # Truncation: Restrict the noise values to a specific range 
        # (commonly used in steganography and forgery detection)
        out = torch.clamp(out, min=-3.0, max=3.0)
        return out

# ==============================================================================
# 2. Custom Dual-Stream Dataset
# ==============================================================================
class TwoStreamDataset(Dataset):
    def __init__(self, data_dir, is_train=True, image_size=224):
        self.data_dir = data_dir
        self.is_train = is_train
        self.classes = {"real": 0, "ai": 1} # Binary Classification
        self.image_paths = []
        self.labels = []
        
        for class_name, label in self.classes.items():
            class_dir = os.path.join(data_dir, class_name)
            if os.path.exists(class_dir):
                for img_path in glob.glob(os.path.join(class_dir, "*.*")):
                    if img_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                        self.image_paths.append(img_path)
                        self.labels.append(label)
                        
        print(f"Loaded {len(self.image_paths)} images from {data_dir}")

        # RGB Image Augmentations
        if is_train:
            self.transform = transforms.Compose([
                transforms.Resize((image_size + 32, image_size + 32)),
                transforms.RandomCrop((image_size, image_size)),
                transforms.RandomHorizontalFlip(),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])
        else:
            self.transform = transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])

        # SRM Input just needs basic tensor conversion (no normalization)
        self.srm_transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor()
        ])

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        
        try:
            image = Image.open(img_path).convert('RGB')
            # The standard RGB tensor for EfficientNet
            rgb_tensor = self.transform(image)
            # The raw tensor for the SRM filter (without ImageNet normalization)
            srm_input = self.srm_transform(image)
        except Exception as e:
            print(f"Error loading {img_path}: {e}")
            rgb_tensor = torch.zeros((3, 224, 224))
            srm_input = torch.zeros((3, 224, 224))
            
        return rgb_tensor, srm_input, torch.tensor(label, dtype=torch.long)

# ==============================================================================
# 3. Two-Stream Fusion Architecture
# ==============================================================================
class TwoStreamFusionNetwork(nn.Module):
    def __init__(self, num_classes=2):
        super(TwoStreamFusionNetwork, self).__init__()
        
        # --- BRANCH 1: Spatial Stream (EfficientNet-B0) ---
        # We load a pre-trained EfficientNet to extract deep semantic features (shapes, lighting, objects)
        self.rgb_backbone = models.efficientnet_b0(weights="DEFAULT")
        # Remove the final classification layer so we just get the feature vector (1280 dimensions for B0)
        self.rgb_backbone.classifier = nn.Identity() 
        rgb_feature_dim = 1280 
        
        # --- BRANCH 2: Noise Stream (SRM + CNN) ---
        # 1. Apply the SRM Filter
        self.srm_filter = SRMConv2d(inc=3) # Output: 9 channels
        
        # 2. Lightweight CNN to process the 9-channel noise residual
        self.noise_cnn = nn.Sequential(
            nn.Conv2d(9, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2), # 112x112
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2), # 56x56
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((1, 1)) # Output: 128 dimensions
        )
        noise_feature_dim = 128
        
        # --- FUSION BLOCK ---
        # Concatenate RGB features (1280) and Noise features (128) -> Total 1408
        fusion_dim = rgb_feature_dim + noise_feature_dim
        
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(fusion_dim, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.3),
            nn.Linear(512, num_classes)
        )
        
    def forward(self, rgb_x, srm_x):
        # 1. Process RGB Stream
        rgb_features = self.rgb_backbone(rgb_x)
        
        # 2. Process Noise Stream
        srm_filtered = self.srm_filter(srm_x)
        noise_features = self.noise_cnn(srm_filtered)
        noise_features = noise_features.view(noise_features.size(0), -1) # Flatten
        
        # 3. Feature Fusion (Concatenation)
        fused = torch.cat((rgb_features, noise_features), dim=1)
        
        # 4. Final Classification
        out = self.classifier(fused)
        return out

# ==============================================================================
# 4. Training Loop (with Early Stopping & LR Scheduling)
# ==============================================================================
def train_model(data_dir, output_dir, epochs=30, batch_size=16, lr=1e-4):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Starting Dual-Branch Training on {device}")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Dataloaders
    train_dataset = TwoStreamDataset(os.path.join(data_dir, "train"), is_train=True)
    val_dataset = TwoStreamDataset(os.path.join(data_dir, "validation"), is_train=False)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2)
    
    # Model, Loss, Optimizer
    model = TwoStreamFusionNetwork(num_classes=2).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    
    # Scheduler: Reduces learning rate if validation loss plateaus
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=3, factor=0.5)
    
    best_val_loss = float('inf')
    early_stop_patience = 7
    epochs_no_improve = 0
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        print(f"\nEpoch [{epoch+1}/{epochs}]")
        progress_bar = tqdm(train_loader, desc="Training", leave=False)
        
        for rgb_img, srm_img, labels in progress_bar:
            rgb_img, srm_img, labels = rgb_img.to(device), srm_img.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(rgb_img, srm_img)
            loss = criterion(outputs, labels)
            
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            progress_bar.set_postfix({'Loss': f"{loss.item():.4f}"})
            
        train_acc = 100 * correct / total
        train_loss = running_loss / len(train_loader)
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for rgb_img, srm_img, labels in tqdm(val_loader, desc="Validation", leave=False):
                rgb_img, srm_img, labels = rgb_img.to(device), srm_img.to(device), labels.to(device)
                
                outputs = model(rgb_img, srm_img)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
                
        val_acc = 100 * val_correct / val_total
        avg_val_loss = val_loss / len(val_loader)
        
        print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
        print(f"Val Loss:   {avg_val_loss:.4f} | Val Acc:   {val_acc:.2f}%")
        
        scheduler.step(avg_val_loss)
        
        # Checkpoint Saving & Early Stopping
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            epochs_no_improve = 0
            save_path = os.path.join(output_dir, "sota_dual_branch.pth")
            torch.save(model.state_dict(), save_path)
            print(f"New best model saved to {save_path}")
        else:
            epochs_no_improve += 1
            print(f"No improvement for {epochs_no_improve} epochs.")
            if epochs_no_improve >= early_stop_patience:
                print(f"Early stopping triggered after {epoch+1} epochs!")
                break

if __name__ == "__main__":
    # Adjust paths here based on your environment
    DATA_DIRECTORY = "../my_dataset"
    OUTPUT_DIRECTORY = "runs"
    
    # Run the training pipeline
    train_model(data_dir=DATA_DIRECTORY, output_dir=OUTPUT_DIRECTORY, epochs=30, batch_size=8)
