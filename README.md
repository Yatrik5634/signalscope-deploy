# SignalScope — AI-Generated Image Detection System

> A state-of-the-art media forensics platform that detects whether an image is real or AI-generated using a Dual-Stream Deep Learning architecture with SRM noise analysis.

**Live Demo:** [https://signalscope.lovable.app](https://signalscope.lovable.app)  
**Backend API:** [https://signalscope-deploy.onrender.com/predict](https://signalscope-deploy.onrender.com/predict)

---

## Core + Bonus Modules

| Module | Description | Status |
|--------|-------------|--------|
| **Core** | Binary Real vs AI-Generated detection | ✅ Complete |
| **Module A** | Faithful Explanation (ELA Heatmap + Cues) | ✅ Complete |
| **Module B** | Generator Attribution (Diffusion/GAN family) | ✅ Complete |
| **Module C** | Robustness to Degradation (Stability Score) | ✅ Complete |
| **Module D** | Provenance & Metadata (EXIF + C2PA) | ✅ Complete |
| **Module E** | Multimodal Consistency (Image + Text) | ✅ Complete |
| **Module F** | Fast Deployment (Render Cloud) | ✅ Complete |

---

## 10-Minute Reproducibility Guide

### Option 1: Web UI (Fastest)
1. Visit [https://signalscope.lovable.app](https://signalscope.lovable.app)
2. Upload any image (JPG, PNG, WEBP, up to 12MB)
3. View the verdict, heatmap, and all module outputs

### Option 2: CLI (cURL)
```bash
curl -X POST "https://signalscope-deploy.onrender.com/predict" \
  -F "image=@test_image.jpg" \
  -F "caption=A photograph of a sunset"
```

### Option 3: Run Locally
```bash
git clone https://github.com/Yatrik5634/signalscope-deploy.git
cd signalscope-deploy
pip install -r requirements.txt
python api.py
# Server starts at http://localhost:8000
```

---

## Architecture

```
Input Image (RGB)
    ├── Branch 1: EfficientNet-B0 (Spatial Stream) → 1280-dim features
    └── Branch 2: SRM Filters → Noise CNN → 128-dim features
                        ↓
              Concatenation (1408-dim)
                        ↓
              FC(512) → Dropout → FC(2) → Softmax
                        ↓
              Temperature Scaling (T=2.0)
                        ↓
              Calibrated Confidence Score
```

---

## Benchmark Metrics

| Metric | Score |
|--------|-------|
| Overall ROC-AUC | 0.92 |
| Macro-F1 | 0.89 |
| False Positive Rate | 0.08 |
| Validation Accuracy | 90.2% |

---

## Dataset Sources
- **CIFAKE** — Real and AI-generated image pairs
- **GenImage** — Multi-generator synthetic image benchmark

---

## Ethical Disclosure
- All verdicts are **likelihood estimates**, never definitive accusations
- The system uses non-accusatory language ("Likely AI-Generated" vs "Fake")
- No personal deepfake imagery is processed or stored
- Output includes honest uncertainty communication

---

## Tech Stack
- **ML:** PyTorch, torchvision, EfficientNet-B0, SRM Filters
- **Backend:** FastAPI, Uvicorn, Pillow
- **Frontend:** React, TypeScript, TanStack Router, Tailwind CSS
- **Deployment:** Render (Backend), Lovable (Frontend)

---

## License
MIT License — Built for Smart India Hackathon 2025
