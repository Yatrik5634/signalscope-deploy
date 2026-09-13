import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/signalscope/SiteFooter";
import { SiteHeader } from "@/components/signalscope/SiteHeader";

const TITLE = "About SignalScope — How Detection Works & Responsible Use";
const DESCRIPTION =
  "How SignalScope analyzes an image step by step, and why every result is a probability rather than proof.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AboutPage,
});

const PIPELINE = [
  { step: "01", title: "Upload Image", body: "The file is checked for type and size before anything else happens." },
  { step: "02", title: "Image Analysis", body: "The image is decoded and normalized to the detector's input size." },
  { step: "03", title: "AI Detection", body: "The detector looks for traces that image generators tend to leave." },
  { step: "04", title: "Confidence Calculation", body: "The raw score is turned into a calibrated likelihood." },
  { step: "05", title: "Visual Explanation", body: "A heatmap marks the regions that influenced the score most." },
  { step: "06", title: "Final Result", body: "Verdict, confidence and written signals are shown together." },
];

const NOTICES = [
  "Results are probabilistic estimates, not measurements.",
  "The detector can make mistakes on both real and generated images.",
  "A result is never definitive proof of how an image was made.",
  "Results must not be used to accuse, identify or profile any person.",
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 md:px-8">
        <section className="py-10 md:py-14">
          <div className="font-mono text-xs text-primary">(d) about</div>
          <h1 className="mt-4 max-w-[28ch] text-balance font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] tracking-tight">
            A reading instrument, not a judge.
          </h1>
          <p className="mt-5 max-w-[60ch] text-pretty text-base text-muted-foreground md:text-lg">
            SignalScope is a media-forensics prototype for detecting AI-generated images. The interface stays
            deliberately thin: it sends an image to a detection service and presents whatever that service returns —
            a label, a likelihood, a heatmap and a short list of signals. The detection model can be replaced at any
            time without changing what you see here.
          </p>
        </section>

        <section id="how" className="scroll-mt-20 py-8 md:py-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs text-primary">(b)</span>
            <h2 className="font-display text-3xl tracking-tight">How it works</h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {PIPELINE.map((s) => (
              <li key={s.step} className="panel-sm p-5">
                <div className="font-mono text-[11px] text-muted-foreground">{s.step}</div>
                <div className="mt-1.5 font-semibold">{s.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="responsible" className="scroll-mt-20 py-8 md:py-10">
          <div className="panel p-5 md:p-7">
            <div className="font-mono text-[11px] text-primary">(c) responsible AI</div>
            <h2 className="mt-3 font-display text-3xl tracking-tight">Read every score carefully</h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {NOTICES.map((notice) => (
                <li key={notice} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-verdict-ai" />
                  {notice}
                </li>
              ))}
            </ul>
            <Link
              to="/"
              hash="analyze"
              className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary-dark"
            >
              Analyze an image
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
