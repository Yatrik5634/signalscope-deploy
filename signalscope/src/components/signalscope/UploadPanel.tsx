import { useRef, useState, type DragEvent } from "react";
import {
  ACCEPTED_LABEL,
  ACCEPTED_TYPES,
  MAX_LABEL,
  formatBytes,
  friendlyMessage,
  validateImage,
} from "@/lib/prediction";

export interface SelectedImage {
  file: File;
  dataUrl: string;
  name: string;
  size: number;
}

interface Props {
  image: SelectedImage | null;
  isAnalyzing: boolean;
  error: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onAnalyze: () => void;
  onError: (message: string) => void;
}

export function UploadPanel({ image, isAnalyzing, error, onSelect, onRemove, onAnalyze, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    const problem = validateImage(file);
    if (problem) {
      onError(friendlyMessage(problem));
      return;
    }
    onSelect(file as File);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (isAnalyzing) return;
    handleFiles(e.dataTransfer.files);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <section id="analyze" className="scroll-mt-20 py-6 md:py-8">
      <div className="panel p-5 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-xs text-muted-foreground">(a) intake · calibrated light table</div>
          <div className="font-mono text-[11px] text-muted-foreground">
            {ACCEPTED_LABEL} · ≤ {MAX_LABEL}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!isAnalyzing) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-5 transition-colors md:p-7 ${
            dragging ? "border-primary bg-primary-soft/70" : "border-primary/55 bg-primary-soft/30"
          }`}
        >
          {image ? (
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <img
                src={image.dataUrl}
                alt="Selected image preview"
                width={112}
                height={112}
                className="size-28 shrink-0 rounded-xl object-cover ring-1 ring-foreground/5"
              />
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="truncate text-base font-semibold">{image.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ready · {formatBytes(image.size)} · preview loaded
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  <button
                    type="button"
                    onClick={onRemove}
                    disabled={isAnalyzing}
                    className="rounded-md bg-frost px-2.5 py-1 text-xs font-medium ring-1 ring-foreground/5 transition-colors hover:bg-frost/70 disabled:opacity-50"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={openPicker}
                    disabled={isAnalyzing}
                    className="rounded-md bg-frost px-2.5 py-1 text-xs font-medium ring-1 ring-foreground/5 transition-colors hover:bg-frost/70 disabled:opacity-50"
                  >
                    Replace
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="w-full shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                {isAnalyzing ? "Analyzing…" : "Analyze Image"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openPicker}
              className="flex w-full flex-col items-center gap-2 py-6 text-center"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-frost text-primary ring-1 ring-foreground/5">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 16V4m0 0 4 4m-4-4L8 8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-base font-semibold">Drag an image here, or click to browse</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {ACCEPTED_LABEL} · up to {MAX_LABEL}
              </span>
            </button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-verdict-ai-soft px-4 py-3 text-sm font-medium text-verdict-ai ring-1 ring-verdict-ai/20"
          >
            {error}
          </p>
        )}

        {isAnalyzing && (
          <div className="relative mt-4 flex items-center gap-4 overflow-hidden rounded-2xl bg-foreground p-4 text-background md:p-5">
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
              <div className="sweep-bar absolute bottom-0 top-0 w-1/4 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            <div className="relative grid size-9 place-items-center rounded-lg bg-background/10">
              <div className="pulse-soft size-3 rounded-full bg-primary" />
            </div>
            <div className="relative">
              <p className="text-sm font-medium">Analyzing image…</p>
              <p className="mt-0.5 font-mono text-[11px] text-background/60">
                sampling texture · lighting · geometry
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
