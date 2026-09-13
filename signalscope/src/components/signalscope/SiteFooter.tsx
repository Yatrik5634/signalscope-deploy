export function SiteFooter() {
  return (
    <footer id="responsible" className="mt-4 border-t border-border/60 bg-frost/50 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[1fr_auto] md:px-8">
        <div>
          <div className="font-mono text-[11px] text-primary">(c) responsible use</div>
          <p className="mt-2 max-w-[52ch] text-pretty text-sm text-muted-foreground">
            Results are probabilistic. The detector can be wrong, and a score is never proof. Never use SignalScope to
            accuse, identify, or profile a person.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="size-2.5 rounded-[3px] bg-verdict-ai" />
          AI-generated
          <span className="ml-2 size-2.5 rounded-[3px] bg-verdict-real" />
          Real
        </div>
      </div>
    </footer>
  );
}
