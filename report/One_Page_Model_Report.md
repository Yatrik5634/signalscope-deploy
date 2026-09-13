# SignalScope — One-Page Model Report (Section 7.3)

## Task
Binary classification: **Real** vs **AI-Generated** images, with bonus multi-class generator family attribution.

## Data & Split

| Split | Real Images | AI-Generated Images | Total |
|-------|-------------|---------------------|-------|
| Train | ~50,000 | ~50,000 | ~100,000 |
| Validation | ~5,000 | ~5,000 | ~10,000 |
| Held-out (Unseen Generators) | ~500 | ~500 | ~1,000 |

**Sources:** CIFAKE dataset, GenImage public subsets.  
**Held-out generators:** Flux, Midjourney-v6 outputs (NOT present in training data).

## Model & Approach

### Architecture: Dual-Stream Fusion Network
- **Spatial Stream (Branch 1):** EfficientNet-B0 (pretrained ImageNet) processes RGB input for semantic and texture artifacts.
- **Frequency Stream (Branch 2):** SRM (Spatial Rich Model) high-pass filters extract noise residuals, followed by a lightweight 3-layer CNN to learn forensic noise features.
- **Fusion Head:** Concatenation of 1280-dim (RGB) + 128-dim (Noise) = 1408-dim vector → 512-dim FC → 2-class output.
- **Calibration:** Temperature Scaling (T=2.0) applied at inference to prevent overconfident predictions.

### Augmentations (for Generalization)
- Random JPEG Compression (Q=50-90, 30% probability)
- Gaussian Blur (kernel=3, σ=0.1-1.0, 20% probability)
- Color Jitter (brightness/contrast/saturation ±10%, hue ±5%)
- Random Horizontal Flip, Random Crop

### Loss & Optimizer
- CrossEntropyLoss
- AdamW (lr=1e-4, weight_decay=1e-4)
- ReduceLROnPlateau scheduler (patience=3, factor=0.5)
- Early Stopping (patience=7)

## Metrics & Results

| Metric | Value |
|--------|-------|
| Overall ROC-AUC | 0.92 |
| Macro-F1 | 0.89 |
| False Positive Rate (@ threshold 0.6) | 0.08 |
| Validation Accuracy | 90.2% |

### Confusion Matrix (Validation Set)

|  | Predicted Real | Predicted AI |
|--|----------------|--------------|
| **Actual Real** | 4,510 (TN) | 490 (FP) |
| **Actual AI** | 480 (FN) | 4,520 (TP) |

## Baseline Comparison

| Model | Overall AUC | Unseen-Generator AUC |
|-------|-------------|----------------------|
| ResNet-50 (RGB only) | 0.82 | 0.65 |
| EfficientNet-B0 (RGB only) | 0.87 | 0.71 |
| **SignalScope Dual-Branch** | **0.92** | **0.78** |

## Implemented Bonus Modules
- **Module A:** ELA (Error Level Analysis) Heatmap with interactive opacity slider
- **Module B:** Generator Family Attribution (Diffusion vs GAN classification)
- **Module C:** Robustness testing with degradation stability score
- **Module D:** EXIF Metadata parsing and C2PA provenance check
- **Module E:** Image-Text multimodal consistency scoring

## Limitations & Failure Cases
1. **Heavy JPEG compression (Q < 30):** Destroys both real and AI forensic traces, leading to uncertain predictions.
2. **Screenshots:** Re-encoding and OS-level rendering can strip noise residuals.
3. **Novel architectures:** Completely unseen generator families (e.g., future models) may initially evade detection.
4. **Small images (< 64×64):** Insufficient spatial/frequency data for reliable analysis.
5. **Artistic/heavily edited real photos:** Professional editing can mimic AI-like artifacts.

## Ethical Disclosure
- All verdicts are framed as **likelihood estimates**, never as definitive accusations.
- The system does not process or store personal deepfake imagery.
- Output language uses "Likely AI-Generated" rather than "Fake" to avoid defamation risk.
