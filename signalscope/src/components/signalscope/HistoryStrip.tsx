import { confidencePercent, type PredictionResult } from "@/lib/prediction";

export interface HistoryEntry {
  id: string;
  order: number;
  time: string;
  name: string;
  dataUrl: string;
  result: PredictionResult;
}

interface Props {
  entries: HistoryEntry[];
  activeId: string | null;
  onOpen: (entry: HistoryEntry) => void;
}

export function HistoryStrip({ entries, activeId, onOpen }: Props) {
  if (entries.length === 0) return null;

  return (
    <section id="history" className="scroll-mt-20 py-6 md:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-tight">Session history</h2>
        <span className="font-mono text-[11px] text-muted-foreground">
          this browser · {entries.length} {entries.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {entries.map((entry) => {
          const isAi = entry.result.verdict === "likely AI-generated";
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpen(entry)}
              className={`panel-sm w-[220px] shrink-0 p-3 text-left transition-shadow hover:shadow-plate ${
                activeId === entry.id ? "ring-2 ring-primary/40" : ""
              }`}
            >
              <img
                src={entry.dataUrl}
                alt={`Previous analysis ${entry.name}`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-lg object-cover ring-1 ring-foreground/5"
              />
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                    isAi ? "bg-verdict-ai-soft text-verdict-ai" : "bg-verdict-real-soft text-verdict-real"
                  }`}
                >
                  {isAi ? "AI-generated" : "Likely Real"}
                </span>
                <span className="font-mono text-xs tabular-nums">
                  {confidencePercent(entry.result.confidence)}%
                </span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                {entry.time} · #{entry.order}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
