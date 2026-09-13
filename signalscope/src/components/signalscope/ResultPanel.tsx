import { useState } from "react";
import {
  confidencePercent,
  verdictText,
  type PredictionResult,
} from "@/lib/prediction";

type View = "Original" | "Heatmap" | "Overlay";
const VIEWS: View[] = ["Original", "Heatmap", "Overlay"];

type Tab = "explanation" | "attribution" | "metadata" | "robustness" | "multimodal";

interface Props {
  result: PredictionResult;
  imageUrl: string;
  imageName: string;
  onReset: () => void;
}

export function ResultPanel({ result, imageUrl, imageName, onReset }: Props) {
  const [view, setView] = useState<View>("Overlay");
  const [opacity, setOpacity] = useState(60);
  const [activeTab, setActiveTab] = useState<Tab>("explanation");

  const verdict = result.verdict;
  const isAi = verdict === "likely AI-generated";
  const isUncertain = verdict === "uncertain";
  const percent = confidencePercent(result.confidence);
  const accent = isAi ? "bg-verdict-ai" : isUncertain ? "bg-yellow-500" : "bg-verdict-real";
  const badge = isAi
    ? "bg-verdict-ai-soft text-verdict-ai ring-verdict-ai/20"
    : isUncertain
      ? "bg-yellow-100 text-yellow-700 ring-yellow-400/30"
      : "bg-verdict-real-soft text-verdict-real ring-verdict-real/20";

  const heatmapSrc = result.explanation.heatmap_base64;

  const TABS: { key: Tab; label: string }[] = [
    { key: "explanation", label: "Cues" },
    { key: "attribution", label: "Attribution" },
    { key: "metadata", label: "Metadata" },
    { key: "robustness", label: "Robustness" },
    { key: "multimodal", label: "Multimodal" },
  ];

  return (
    <section id="result" className="scroll-mt-20 py-8 md:py-10">
      <div className="rise-in panel p-5 md:p-7">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Left Column: Image Viewer */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={
                    view === v
                      ? "rounded-lg bg-foreground px-3.5 py-2 text-xs font-medium text-background"
                      : "rounded-lg bg-frost px-3.5 py-2 text-xs font-medium text-muted-foreground ring-1 ring-foreground/5 transition-colors hover:text-foreground"
                  }
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-placeholder ring-1 ring-foreground/5">
              {view !== "Heatmap" && (
                <img
                  src={imageUrl}
                  alt={`Analyzed image ${imageName}`}
                  className="absolute inset-0 size-full object-contain"
                />
              )}
              {view !== "Original" && heatmapSrc && (
                <img
                  src={heatmapSrc.startsWith("data:") ? heatmapSrc : `data:image/jpeg;base64,${heatmapSrc}`}
                  alt="Grad-CAM attention heatmap"
                  loading="lazy"
                  className={`absolute inset-0 size-full object-contain mix-blend-multiply`}
                  style={{ opacity: view === "Overlay" ? opacity / 100 : 1 }}
                />
              )}
            </div>

            {/* Opacity Slider */}
            {view === "Overlay" && (
              <div className="mt-3 flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground">Opacity</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border/60 accent-primary"
                />
                <span className="font-mono text-[11px] text-muted-foreground w-8 text-right">{opacity}%</span>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-verdict-ai" />
                high signal
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-signal-med" />
                medium
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-signal-low" />
                low
              </span>
            </div>
          </div>

          {/* Right Column: Results */}
          <div>
            {/* Verdict Badge */}
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${badge}`}
            >
              {verdict === "likely AI-generated" ? "Likely AI-Generated" : verdict === "likely real" ? "Likely Real" : "Uncertain / Inconclusive"}
            </div>

            {/* Confidence Gauge */}
            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Calibrated Confidence</span>
                <span className="font-mono text-2xl font-medium tabular-nums">
                  {percent}
                  <span className="text-base text-muted-foreground">%</span>
                </span>
              </div>
              <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-border/60">
                <div className={`h-full rounded-full ${accent} transition-all duration-500`} style={{ width: `${percent}%` }} />
                {/* Threshold marker */}
                <div className="absolute top-0 h-full w-0.5 bg-foreground/40" style={{ left: `${(result.threshold_used || 0.6) * 100}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>0</span>
                <span>threshold: {((result.threshold_used || 0.6) * 100).toFixed(0)}%</span>
                <span>100</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">A calibrated probability estimate — not definitive proof.</p>
            </div>

            {/* Summary */}
            <div className="mt-4 rounded-lg bg-frost p-3 text-sm">
              {result.explanation.summary}
            </div>

            {/* Tab Navigation */}
            <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border/40 pb-0">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`whitespace-nowrap rounded-t-md px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === t.key
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 min-h-[120px]">
              {/* Cues Tab */}
              {activeTab === "explanation" && (
                <ul className="space-y-2 text-sm">
                  {result.explanation.cues.map((cue, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                          i === result.explanation.cues.length - 1 ? "bg-signal-med" : accent
                        }`}
                      />
                      {cue}
                    </li>
                  ))}
                </ul>
              )}

              {/* Attribution Tab */}
              {activeTab === "attribution" && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-frost p-4">
                    <div className="font-mono text-[11px] text-muted-foreground mb-2">GENERATOR FAMILY</div>
                    <div className="text-lg font-semibold">{result.attribution.family}</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.round(result.attribution.family_confidence * 100)}%` }} />
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                      Confidence: {Math.round(result.attribution.family_confidence * 100)}%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generator family predicted by analyzing noise patterns and frequency-domain artifacts.
                  </p>
                </div>
              )}

              {/* Metadata Tab */}
              {activeTab === "metadata" && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-frost p-4">
                    <div className="font-mono text-[11px] text-muted-foreground mb-3">EXIF DATA</div>
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(result.metadata.exif_summary).map(([key, val]) => (
                          <tr key={key} className="border-b border-border/20 last:border-0">
                            <td className="py-1.5 pr-3 font-medium text-muted-foreground">{key}</td>
                            <td className="py-1.5 font-mono text-xs">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="rounded-lg bg-frost p-4">
                    <div className="font-mono text-[11px] text-muted-foreground mb-2">C2PA / CONTENT CREDENTIALS</div>
                    <div className="flex items-center gap-2">
                      <span className={`size-2.5 rounded-full ${result.metadata.c2pa_valid ? "bg-verdict-real" : result.metadata.c2pa_present ? "bg-yellow-500" : "bg-muted-foreground/40"}`} />
                      <span className="text-sm font-medium">
                        {result.metadata.c2pa_valid ? "Valid Signature" : result.metadata.c2pa_present ? "Present (Unverified)" : "Not Present"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Robustness Tab */}
              {activeTab === "robustness" && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-frost p-4">
                    <div className="font-mono text-[11px] text-muted-foreground mb-2">STABILITY SCORE</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-medium tabular-nums">
                        {Math.round(result.robustness.stability_score * 100)}%
                      </span>
                      <span className="text-xs text-muted-foreground">stable under degradation</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                      <div className="h-full rounded-full bg-verdict-real transition-all duration-500" style={{ width: `${Math.round(result.robustness.stability_score * 100)}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-frost p-4">
                    <div className="font-mono text-[11px] text-muted-foreground mb-2">CONFIDENCE DELTA</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-lg font-medium tabular-nums text-verdict-real">
                        Δ {(result.robustness.degradation_delta * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">change after JPEG compression</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Measures how much the model's prediction shifts when applying JPEG compression and downsampling.
                  </p>
                </div>
              )}

              {/* Multimodal Tab */}
              {activeTab === "multimodal" && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-frost p-4">
                    <div className="font-mono text-[11px] text-muted-foreground mb-2">IMAGE-TEXT CONSISTENCY</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-medium tabular-nums">
                        {Math.round(result.multimodal_consistency.score * 100)}%
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        result.multimodal_consistency.is_consistent
                          ? "bg-verdict-real-soft text-verdict-real"
                          : "bg-verdict-ai-soft text-verdict-ai"
                      }`}>
                        {result.multimodal_consistency.is_consistent ? "Consistent" : "Inconsistent"}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          result.multimodal_consistency.is_consistent ? "bg-verdict-real" : "bg-verdict-ai"
                        }`}
                        style={{ width: `${Math.round(result.multimodal_consistency.score * 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Measures semantic alignment between the uploaded image and the provided caption using cross-modal embedding similarity.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 font-mono text-[11px] text-muted-foreground">
              Analysis complete · {imageName}
            </div>

            <button
              type="button"
              onClick={onReset}
              className="mt-4 w-full rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
