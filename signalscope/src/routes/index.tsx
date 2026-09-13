import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState, useEffect } from "react";
import { Hero } from "@/components/signalscope/Hero";
import { HowItWorks } from "@/components/signalscope/HowItWorks";
import { ResultPanel } from "@/components/signalscope/ResultPanel";
import { SiteFooter } from "@/components/signalscope/SiteFooter";
import { SiteHeader } from "@/components/signalscope/SiteHeader";
import { HistoryStrip, type HistoryEntry } from "@/components/signalscope/HistoryStrip";
import { UploadPanel, type SelectedImage } from "@/components/signalscope/UploadPanel";
import {
  PredictionError,
  friendlyMessage,
  predictImage,
  validateImage,
  type PredictionResult,
} from "@/lib/prediction";

const TITLE = "SignalScope — AI-Generated Image Detection";
const DESCRIPTION =
  "Upload an image and SignalScope estimates whether it was AI-generated, with a confidence score, Grad-CAM heatmap and plain-language explanation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HomePage,
});

interface ViewedResult {
  result: PredictionResult;
  dataUrl: string;
  name: string;
  historyId: string | null;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function HomePage() {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewed, setViewed] = useState<ViewedResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("signalscope-history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("signalscope-history", JSON.stringify(history));
    } catch (e) {
      console.warn("Could not save history to localStorage. Limit exceeded.", e);
      // If we hit the quota, we could potentially clear old history here,
      // but catching the error is enough to prevent the page from crashing.
    }
  }, [history]);

  const handleSelect = useCallback(async (file: File) => {
    setError(null);
    setViewed(null);
    try {
      const dataUrl = await readAsDataUrl(file);
      setImage({ file, dataUrl, name: file.name, size: file.size });
    } catch {
      setError(friendlyMessage("UPLOAD_FAILED"));
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    const problem = validateImage(image?.file);
    if (problem || !image) {
      setError(friendlyMessage(problem ?? "NO_IMAGE"));
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = await predictImage(image.file);
      const entry: HistoryEntry = {
        id: `${Date.now()}-${image.name}`,
        order: history.length + 1,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        name: image.name,
        dataUrl: image.dataUrl,
        result,
      };
      setHistory((prev) => [entry, ...prev]);
      setViewed({ result, dataUrl: image.dataUrl, name: image.name, historyId: entry.id });
      requestAnimationFrame(() =>
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (err) {
      setError(
        err instanceof PredictionError ? err.message : friendlyMessage("PREDICTION_FAILED"),
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [history.length, image]);

  const handleReset = useCallback(() => {
    setImage(null);
    setViewed(null);
    setError(null);
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openHistory = useCallback((entry: HistoryEntry) => {
    setViewed({ result: entry.result, dataUrl: entry.dataUrl, name: entry.name, historyId: entry.id });
    requestAnimationFrame(() =>
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 md:px-8">
        <Hero />
        <UploadPanel
          image={image}
          isAnalyzing={isAnalyzing}
          error={error}
          onSelect={handleSelect}
          onRemove={() => {
            setImage(null);
            setError(null);
          }}
          onAnalyze={handleAnalyze}
          onError={setError}
        />
        {viewed && !isAnalyzing && (
          <ResultPanel
            result={viewed.result}
            imageUrl={viewed.dataUrl}
            imageName={viewed.name}
            onReset={handleReset}
          />
        )}
        <HistoryStrip entries={history} activeId={viewed?.historyId ?? null} onOpen={openHistory} />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
