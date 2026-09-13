import argparse
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

from dataset import SignalScopeDataset
from models.fusion_model import SignalScopeFusionModel

def train_model(args):
    print("Initializing SignalScope Training Pipeline...")
    
    # 1. Device Selection (GPU if available, otherwise CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # 2. Setup Directories
    os.makedirs(args.output_dir, exist_ok=True)
    
    # 3. Load Datasets
    # We assume you have a folder structure like: dataset/train/real, dataset/train/ai
    train_dir = os.path.join(args.data_dir, "train")
    val_dir = os.path.join(args.data_dir, "validation")
    
    # If the folders don't exist yet, we can't train!
    if not os.path.exists(train_dir):
        print(f"Error: Training directory '{train_dir}' not found.")
        print("Please create the dataset structure first!")
        return

    train_dataset = SignalScopeDataset(train_dir, is_train=True, image_size=args.image_size)
    val_dataset = SignalScopeDataset(val_dir, is_train=False, image_size=args.image_size)
    
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False)
    
    # 4. Initialize Model
    model = SignalScopeFusionModel(num_classes=3, num_fft_features=3, backbone_name=args.model)
    model = model.to(device)
    
    # 5. Loss Function and Optimizer
    # CrossEntropyLoss is standard for classification (Real vs AI)
    criterion = nn.CrossEntropyLoss()
    # Adam optimizer is very stable and fast
    optimizer = optim.Adam(model.parameters(), lr=args.learning_rate)
    
    # 6. Training Loop
    best_val_loss = float('inf')
    
    for epoch in range(args.epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        print(f"\nEpoch {epoch+1}/{args.epochs}")
        print("-" * 20)
        
        for batch_idx, (images, fft_features, labels) in enumerate(train_loader):
            # Move data to GPU if available
            images = images.to(device)
            fft_features = fft_features.to(device)
            labels = labels.to(device)
            
            # Zero the gradients
            optimizer.zero_grad()
            
            # Forward pass (predict)
            outputs = model(images, fft_features)
            loss = criterion(outputs, labels)
            
            # Backward pass (learn)
            loss.backward()
            optimizer.step()
            
            # Track statistics
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            if batch_idx % 10 == 0:
                print(f"Batch {batch_idx}/{len(train_loader)} - Loss: {loss.item():.4f}")
                
        train_accuracy = 100 * correct / total
        print(f"Train Loss: {running_loss/len(train_loader):.4f} | Train Acc: {train_accuracy:.2f}%")
        
        # 7. Validation Loop
        model.eval() # Set model to evaluation mode (turns off dropout)
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad(): # Don't calculate gradients during validation (saves memory)
            for images, fft_features, labels in val_loader:
                images = images.to(device)
                fft_features = fft_features.to(device)
                labels = labels.to(device)
                
                outputs = model(images, fft_features)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
                
        val_accuracy = 100 * val_correct / val_total
        avg_val_loss = val_loss/len(val_loader)
        print(f"Val Loss:   {avg_val_loss:.4f} | Val Acc:   {val_accuracy:.2f}%")
        
        # 8. Save the best model!
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            save_path = os.path.join(args.output_dir, "best_fusion_model.pth")
            torch.save(model.state_dict(), save_path)
            print(f"-> Saved new best model to {save_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SignalScope Training Pipeline")
    parser.add_argument("--data-dir", type=str, default="dataset", help="Directory containing train/validation folders")
    parser.add_argument("--output-dir", type=str, default="runs", help="Where to save the trained model")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--learning-rate", type=float, default=0.0001, help="Learning rate for Adam optimizer")
    parser.add_argument("--image-size", type=int, default=224, help="Size to resize images to")
    parser.add_argument("--model", type=str, default="efficientnet_b0", help="Backbone CNN model name")
    
    args = parser.parse_args()
    train_model(args)
