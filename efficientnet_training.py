import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from torch.optim.lr_scheduler import CosineAnnealingLR
import os
import numpy as np

def get_efficientnet_b4(num_classes):
    """
    Loads a pre-trained EfficientNet-B4 model for maximum accuracy.
    """
    model = models.efficientnet_b4(weights=models.EfficientNet_B4_Weights.DEFAULT)
    
    # Initially freeze the base layers for phase 1
    for param in model.parameters():
        param.requires_grad = False
        
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    
    return model

def calculate_class_weights(dataset):
    """
    Calculates weights for each class to prevent false positives in imbalanced datasets.
    """
    targets = dataset.targets
    class_counts = np.bincount(targets)
    total_samples = len(targets)
    
    class_weights = total_samples / (len(class_counts) * class_counts)
    return torch.FloatTensor(class_weights)

def train_model(data_dir, num_classes, num_epochs=20, batch_size=16, learning_rate=0.001):
    """
    High-Accuracy training loop using EfficientNet-B4.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # EfficientNet-B4 uses 380x380 resolution
    input_size = 380

    # 1. Advanced Data Transforms for Maximum AI Detection Robustness
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop((input_size, input_size), scale=(0.7, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomApply([transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3)], p=0.4),
            transforms.RandomApply([transforms.RandomRotation(20)], p=0.4),
            transforms.RandomApply([transforms.GaussianBlur(kernel_size=5)], p=0.3),
            transforms.RandomAdjustSharpness(sharpness_factor=2, p=0.3),
            transforms.RandomAutocontrast(p=0.3),
            transforms.ToTensor(),
            transforms.RandomErasing(p=0.2, scale=(0.02, 0.2)), # Randomly erase parts of the image
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize((400, 400)),
            transforms.CenterCrop((input_size, input_size)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    image_datasets = {x: ImageFolder(root=os.path.join(data_dir, x), transform=data_transforms[x])
                      for x in ['train', 'val']}
    
    dataloaders = {x: DataLoader(image_datasets[x], batch_size=batch_size, shuffle=True, num_workers=4)
                   for x in ['train', 'val']}

    class_weights = calculate_class_weights(image_datasets['train']).to(device)
    print(f"Computed Class Weights: {class_weights}")

    model = get_efficientnet_b4(num_classes).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights)
    
    # Phase 1: Train only classifier with AdamW (weight decay prevents overfitting)
    optimizer = optim.AdamW(model.classifier.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = CosineAnnealingLR(optimizer, T_max=num_epochs)

    best_acc = 0.0
    unfrozen = False

    for epoch in range(num_epochs):
        print(f'Epoch {epoch}/{num_epochs - 1}')
        print('-' * 10)

        # Unfreeze base model after 3 epochs (B4 learns fast)
        if epoch == 3 and not unfrozen:
            print("\n--- Unfreezing base model layers for full fine-tuning! ---")
            for param in model.parameters():
                param.requires_grad = True
            optimizer = optim.AdamW(model.parameters(), lr=learning_rate * 0.1, weight_decay=1e-4)
            scheduler = CosineAnnealingLR(optimizer, T_max=num_epochs - 3)
            unfrozen = True

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            # Step the scheduler AFTER the epoch if we are in train phase
            if phase == 'train':
                scheduler.step()

            epoch_loss = running_loss / len(image_datasets[phase])
            epoch_acc = running_corrects.double() / len(image_datasets[phase])

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

            if phase == 'val':
                if epoch_acc > best_acc:
                    best_acc = epoch_acc
                    torch.save(model.state_dict(), 'efficientnet_b4_best.pth')
                    print(f"*** New best model saved with accuracy: {best_acc:.4f} ***")

    print(f'\nTraining complete! Best Validation Accuracy: {best_acc:.4f}')
    print("The best model has been saved to 'efficientnet_b4_best.pth'.")

if __name__ == '__main__':
    # 1. Update `data_dir` to your actual dataset path containing 'train' and 'val' folders.
    train_model(data_dir="D:/SIH/my_dataset", num_classes=2, num_epochs=20)
