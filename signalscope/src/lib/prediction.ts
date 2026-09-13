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

export type PredictionLabel = "AI-generated" | "Real";

export interface PredictionResult {
  label: PredictionLabel;
  confidence: number;
  heatmap: string;
  explanation: string[];
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
  TIMEOUT: "The analysis took too long to respond. Please try again.",
};

export class PredictionError extends Error {
  code: PredictionErrorCode;
  constructor(code: PredictionErrorCode) {
    super(MESSAGES[code]);
    this.code = code;
    this.name = "PredictionError";
  }
}

export const friendlyMessage = (code: PredictionErrorCode) => MESSAGES[code];

/* ---------------------------------------------------------------- config */

export const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ACCEPTED_LABEL = "JPG · PNG · WEBP";
export const MAX_BYTES = 12 * 1024 * 1024;
export const MAX_LABEL = "12 MB";
const REQUEST_TIMEOUT_MS = 120000;

/** Flip to false once the FastAPI backend is live (see predictReal below). */
const USE_MOCK = false;
const PREDICT_ENDPOINT = 'https://signalscope-deploy.onrender.com/predict';

/* ------------------------------------------------------------ validation */

export function validateImage(file: File | null | undefined): PredictionErrorCode | null {
  if (!file) return "NO_IMAGE";
  const type = file.type.toLowerCase();
  const nameOk = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ACCEPTED_TYPES.includes(type) && !nameOk) return "INVALID_TYPE";
  if (file.size === 0) return "UPLOAD_FAILED";
  if (file.size > MAX_BYTES) return "TOO_LARGE";
  return null;
}

/* ------------------------------------------------------------------ mock */

const AI_EXPLANATION = [
  "Unusual texture patterns in smooth regions",
  "Lighting inconsistency across the frame",
  "Repeating frequency signature in the background",
];

const REAL_EXPLANATION = [
  "Natural sensor noise consistent across the frame",
  "Lighting and shadow directions agree",
  "No repeating generator artifacts detected",
];

async function predictMock(file: File): Promise<PredictionResult> {
  await new Promise((r) => setTimeout(r, 1800));

  // Deterministic pseudo-variation so demos show both verdicts.
  const isAi = (file.size + file.name.length) % 3 !== 0;

  return isAi
    ? {
        label: "AI-generated",
        confidence: 0.88,
        heatmap: mockHeatmap,
        explanation: AI_EXPLANATION,
      }
    : {
        label: "Real",
        confidence: 0.79,
        heatmap: mockHeatmap,
        explanation: REAL_EXPLANATION,
      };
}

/* ------------------------------------------------------------- real call */

async function predictReal(file: File): Promise<PredictionResult> {
  const body = new FormData();
  body.append("image", file);

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

function normalize(data: unknown): PredictionResult {
  const raw = data as Partial<PredictionResult> | null;
  const label = raw?.label === "Real" ? "Real" : raw?.label === "AI-generated" ? "AI-generated" : null;
  const confidence = typeof raw?.confidence === "number" ? raw.confidence : null;
  if (!label || confidence === null || Number.isNaN(confidence)) {
    throw new PredictionError("PREDICTION_FAILED");
  }
  return {
    label,
    confidence: Math.min(1, Math.max(0, confidence > 1 ? confidence / 100 : confidence)),
    heatmap: typeof raw?.heatmap === "string" && raw.heatmap ? raw.heatmap : mockHeatmap,
    explanation: Array.isArray(raw?.explanation) ? raw!.explanation.filter((x) => typeof x === "string") : [],
  };
}

/* ------------------------------------------------------------------- api */

/** The single entry point every component uses to get a prediction. */
export async function predictImage(file: File | null): Promise<PredictionResult> {
  const problem = validateImage(file);
  if (problem) throw new PredictionError(problem);
  try {
    return USE_MOCK ? await predictMock(file as File) : await predictReal(file as File);
  } catch (err) {
    if (err instanceof PredictionError) throw err;
    throw new PredictionError("PREDICTION_FAILED");
  }
}

/* --------------------------------------------------------- presentation */

export const verdictText = (label: PredictionLabel) =>
  label === "AI-generated" ? "Likely AI-generated" : "Likely Real";

export const confidencePercent = (confidence: number) => Math.round(confidence * 100);

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
