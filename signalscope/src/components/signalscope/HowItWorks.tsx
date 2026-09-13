const STAGES = [
  {
    range: "01–02",
    title: "Ingest & normalize",
    body: "The image is validated, decoded and resized to a calibrated size for the detector.",
  },
  {
    range: "03–04",
    title: "Detect & score",
    body: "The detector returns a label and a calibrated probability, not a hard verdict.",
  },
  {
    range: "05–06",
    title: "Explain & report",
    body: "A Grad-CAM trace and plain-language signals show where the detector looked.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-8 md:py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-xs text-primary">(b)</span>
        <h2 className="font-display text-3xl tracking-tight">How it works</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {STAGES.map((s) => (
          <div key={s.range} className="panel-sm p-5">
            <div className="font-mono text-[11px] text-muted-foreground">{s.range}</div>
            <div className="mt-1.5 font-semibold">{s.title}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
