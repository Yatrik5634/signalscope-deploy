import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-frost/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-frost shadow-sm ring-1 ring-foreground/5">
            <div className="size-4 rounded-[5px] bg-primary shadow-[0_0_12px_var(--primary)]" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-tight">SIGNALSCOPE</div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">media forensics · v0.3</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/about" hash="how" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link to="/about" hash="responsible" className="transition-colors hover:text-foreground">
            Responsible AI
          </Link>
          <Link to="/" hash="history" className="transition-colors hover:text-foreground">
            History
          </Link>
        </nav>

        <Link
          to="/"
          hash="analyze"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Analyze Image
        </Link>
      </div>
    </header>
  );
}
