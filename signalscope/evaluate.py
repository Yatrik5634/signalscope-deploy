import argparse
import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix

from dataset import SignalScopeDataset
from models.fusion_model import SignalScopeFusionModel

def evaluate_model(args):
    print("Initializing SignalScope Evaluation Pipeline...")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # 1. Load Dataset
    test_dir = os.path.join(args.data_dir, "test")
    if not os.path.exists(test_dir):
        # Fallback to validation if test doesn't exist
        print(f"Warning: Test directory '{test_dir}' not found. Falling back to validation.")
        test_dir = os.path.join(args.data_dir, "validation")
        if not os.path.exists(test_dir):
            print("Error: No data to evaluate on.")
            return

    test_dataset = SignalScopeDataset(test_dir, is_train=False, image_size=args.image_size)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size, shuffle=False)
    
    # 2. Load Model
    model = SignalScopeFusionModel(num_classes=3, num_fft_features=3, backbone_name=args.model)
    
    if os.path.exists(args.model_path):
        model.load_state_dict(torch.load(args.model_path, map_location=device))
        print(f"Successfully loaded trained weights from {args.model_path}")
    else:
        print(f"Warning: Could not find trained weights at {args.model_path}. Evaluating untrained model!")
        
    model = model.to(device)
    model.eval()
    
    # 3. Evaluation Loop
    all_preds = []
    all_labels = []
    
    print("\nEvaluating...")
    with torch.no_grad():
        for images, fft_features, labels in test_loader:
            images = images.to(device)
            fft_features = fft_features.to(device)
            labels = labels.to(device)
            
            outputs = model(images, fft_features)
            _, predicted = torch.max(outputs.data, 1)
            
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
    # 4. Calculate Scientific Metrics
    print("\n" + "="*50)
    print("                 EVALUATION RESULTS")
    print("="*50)
    
    target_names = ['Real', 'AI-Generated', 'Uncertain']
    
    # Classification Report (Precision, Recall, F1-Score, Accuracy)
    print("\n1. Classification Report:")
    # We use zero_division=0 to prevent warnings if a class is entirely missing from the test set
    report = classification_report(all_labels, all_preds, target_names=target_names, zero_division=0)
    print(report)
    
    # Confusion Matrix
    print("2. Confusion Matrix:")
    cm = confusion_matrix(all_labels, all_preds)
    print(cm)
    print("\nInterpretation: Rows are True Classes, Columns are Predicted Classes.")
    print("="*50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SignalScope Evaluation Pipeline")
    parser.add_argument("--data-dir", type=str, default="dataset", help="Directory containing test/validation folders")
    parser.add_argument("--model-path", type=str, default="runs/best_fusion_model.pth", help="Path to saved model weights")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--image-size", type=int, default=224, help="Image size expected by model")
    parser.add_argument("--model", type=str, default="efficientnet_b0", help="Backbone CNN model name")
    
    args = parser.parse_args()
    evaluate_model(args)
