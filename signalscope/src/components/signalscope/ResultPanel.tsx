import { useState } from "react";
import {
  confidencePercent,
  verdictText,
  type PredictionResult,
} from "@/lib/prediction";

type View = "Original" | "Heatmap" | "Overlay";
const VIEWS: View[] = ["Original", "Heatmap", "Overlay"];

interface Props {
  result: PredictionResult;
  imageUrl: string;
  imageName: string;
  onReset: () => void;
}

export function ResultPanel({ result, imageUrl, imageName, onReset }: Props) {
  const [view, setView] = useState<View>("Overlay");
  const isAi = result.label === "AI-generated";
  const percent = confidencePercent(result.confidence);
  const accent = isAi ? "bg-verdict-ai" : "bg-verdict-real";
  const badge = isAi
    ? "bg-verdict-ai-soft text-verdict-ai ring-verdict-ai/20"
    : "bg-verdict-real-soft text-verdict-real ring-verdict-real/20";

  return (
    <section id="result" className="scroll-mt-20 py-8 md:py-10">
      <div className="rise-in panel p-5 md:p-7">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
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
              {view !== "Original" && (
                <img
                  src={result.heatmap}
                  alt="Grad-CAM attention heatmap"
                  loading="lazy"
                  className={`absolute inset-0 size-full object-contain ${
                    view === "Overlay" ? "opacity-60 mix-blend-multiply" : ""
                  }`}
                />
              )}
            </div>

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

          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${badge}`}
            >
              {verdictText(result.label)}
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Confidence</span>
                <span className="font-mono text-2xl font-medium tabular-nums">
                  {percent}
                  <span className="text-base text-muted-foreground">%</span>
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border/60">
                <div className={`h-full rounded-full ${accent}`} style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>0</span>
                <span>likelihood</span>
                <span>100</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">A probability estimate — not definitive proof.</p>
            </div>

            <div className="mt-6">
              <div className="mb-2 font-mono text-[11px] text-muted-foreground">EXPLANATION</div>
              <ul className="space-y-2 text-sm">
                {result.explanation.map((point, i) => (
                  <li key={point} className="flex gap-2.5">
                    <span
                      className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                        i === result.explanation.length - 1 ? "bg-signal-med" : accent
                      }`}
                    />
                    {point}
                  </li>
                ))}
              </ul>
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
