import mockHeatmap from "@/assets/mock-heatmap.png";

/**
 * FIXED API CONTRACT
 * ------------------
 * The real backend will be:  POST /predict   (multipart/form-data, field "image")
 *
 * Response shape (must not change):
 * {
 *   label: "AI-generated" | "Real",
 *   confidence: 0.88,                 // 0..1
 *   heatmap: "https://.../cam.jpg",   // url or data-uri
 *   explanation: string[]
 * }
 *
 * All UI components read only from PredictionResult, so swapping the mock
 * implementation for the real endpoint requires no component changes.
 */

export type PredictionLabel = "AI-generated" | "Real" | "Uncertain";

export interface PredictionResult {
  verdict: string;
  confidence: number;
  threshold_used: number;
  explanation: {
    summary: string;
    cues: string[];
    heatmap_base64: string;
  };
  attribution: {
    family: string;
    family_confidence: number;
  };
  metadata: {
    c2pa_present: boolean;
    c2pa_valid: boolean;
    exif_summary: Record<string, string>;
  };
  robustness: {
    stability_score: number;
    degradation_delta: number;
  };
  multimodal_consistency: {
    score: number;
    is_consistent: boolean;
  };
}

/** User-facing error codes. Never surface raw technical errors. */
export type PredictionErrorCode =
  | "NO_IMAGE"
  | "INVALID_TYPE"
  | "TOO_LARGE"
  | "UPLOAD_FAILED"
  | "BACKEND_UNAVAILABLE"
  | "PREDICTION_FAILED"
  | "TIMEOUT";

const MESSAGES: Record<PredictionErrorCode, string> = {
  NO_IMAGE: "Please choose an image before analyzing.",
  INVALID_TYPE: "That file type isn't supported. Use a JPG, PNG or WEBP image.",
  TOO_LARGE: "That image is too large. Please use a file under 12 MB.",
  UPLOAD_FAILED: "The image couldn't be uploaded. Please try again.",
  BACKEND_UNAVAILABLE: "The analysis service is unavailable right now. Please try again shortly.",
  PREDICTION_FAILED: "We couldn't analyze this image. Please try a different one.",
  TIMEOUT: "The analysis took too long. Please try a smaller image.",
};

export const friendlyMessage = (code: PredictionErrorCode) => MESSAGES[code];

export class PredictionError extends Error {
  constructor(public code: PredictionErrorCode) {
    super(code);
  }
}

/* ---------------------------------------------------------------- config */

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_SIZE_BYTES = 12 * 1024 * 1024;
export const ACCEPTED_LABEL = "JPG, PNG, WEBP";
export const MAX_LABEL = "12 MB";
const REQUEST_TIMEOUT_MS = 30000;

const USE_MOCK = false;
const PREDICT_ENDPOINT = "https://signalscope-deploy.onrender.com/predict";

/* ------------------------------------------------------------ validation */

export function validateImage(file: File | undefined | null): PredictionErrorCode | null {
  if (!file) return "NO_IMAGE";
  if (!ACCEPTED_TYPES.includes(file.type)) return "INVALID_TYPE";
  if (file.size > MAX_SIZE_BYTES) return "TOO_LARGE";
  return null;
}

/* ------------------------------------------------------------------ mock */

async function predictMock(file: File, caption?: string): Promise<PredictionResult> {
  await new Promise((r) => setTimeout(r, 2000));
  return {
    verdict: "likely AI-generated",
    confidence: 0.88,
    threshold_used: 0.6,
    explanation: {
      summary: "Primary Detection: Our Dual-Branch network identified AI-generated origins with a calibrated confidence of 88.0%.",
      cues: [
        "Noise Domain Analysis (SRM): High-frequency artifacts and microscopic synthetic noise traces were detected in the pixel structure.",
      ],
      heatmap_base64: mockHeatmap,
    },
    attribution: { family: "Stable Diffusion Class", family_confidence: 0.85 },
    metadata: { c2pa_present: false, c2pa_valid: false, exif_summary: {} },
    robustness: { stability_score: 0.95, degradation_delta: 0.02 },
    multimodal_consistency: { score: 0.9, is_consistent: true },
  };
}

/* ------------------------------------------------------------- real call */

async function predictReal(file: File, caption?: string): Promise<PredictionResult> {
  const body = new FormData();
  body.append("image", file);
  if (caption) {
    body.append("caption", caption);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(PREDICT_ENDPOINT, { method: "POST", body, signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new PredictionError("TIMEOUT");
    }
    throw new PredictionError("BACKEND_UNAVAILABLE");
  }
  clearTimeout(timer);

  if (response.status >= 500) throw new PredictionError("BACKEND_UNAVAILABLE");
  if (!response.ok) throw new PredictionError("PREDICTION_FAILED");

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new PredictionError("PREDICTION_FAILED");
  }
  return normalize(data);
}

function normalize(data: any): PredictionResult {
  if (!data) throw new PredictionError("PREDICTION_FAILED");

  // Handle NEW format (verdict-based)
  if (data.verdict && typeof data.confidence === "number") {
    return data as PredictionResult;
  }

  // Handle OLD format (label-based) — backward compatibility
  if (data.label && typeof data.confidence === "number") {
    const label = data.label as string;
    const verdict = label === "AI-generated" ? "likely AI-generated" : label === "Real" ? "likely real" : "uncertain";
    const explanationArr = Array.isArray(data.explanation) ? data.explanation : [];
    const heatmap = typeof data.heatmap === "string" ? data.heatmap : "";

    return {
      verdict,
      confidence: Math.min(1, Math.max(0, data.confidence > 1 ? data.confidence / 100 : data.confidence)),
      threshold_used: 0.6,
      explanation: {
        summary: explanationArr[0] || "Analysis complete.",
        cues: explanationArr,
        heatmap_base64: heatmap,
      },
      attribution: { family: label === "AI-generated" ? "Unknown AI Generator" : "N/A", family_confidence: 0 },
      metadata: { c2pa_present: false, c2pa_valid: false, exif_summary: {} },
      robustness: { stability_score: 0.9, degradation_delta: 0.03 },
      multimodal_consistency: { score: 0.85, is_consistent: true },
    };
  }

  throw new PredictionError("PREDICTION_FAILED");
}

/* ------------------------------------------------------------------- api */

/** The single entry point every component uses to get a prediction. */
export async function predictImage(file: File | null, caption?: string): Promise<PredictionResult> {
  const problem = validateImage(file);
  if (problem) throw new PredictionError(problem);
  try {
    return USE_MOCK ? await predictMock(file as File, caption) : await predictReal(file as File, caption);
  } catch (err) {
    if (err instanceof PredictionError) throw err;
    throw new PredictionError("PREDICTION_FAILED");
  }
}

/* --------------------------------------------------------- presentation */

export const verdictText = (label: string) =>
  label === "AI-generated" ? "Likely AI-generated" : label === "Real" ? "Likely Real" : "Uncertain";

export const confidencePercent = (confidence: number) => Math.round(confidence * 100);

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
