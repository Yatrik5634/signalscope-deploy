import { Link } from "@tanstack/react-router";
import heroPlate from "@/assets/hero-plate.jpg";

export function Hero() {
  return (
    <section className="py-10 md:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="rise-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-frost/70 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/5">
            <span className="pulse-soft size-1.5 rounded-full bg-verdict-ai" />
            Probabilistic detector · not proof
          </div>
          <h1 className="mt-5 text-balance font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
            Where the anomalies <span className="text-primary">glow.</span>
          </h1>
          <p className="mt-5 max-w-[42ch] text-pretty text-base text-muted-foreground md:text-lg">
            SignalScope slides an image under a calibrated light table and reads the traces that generators leave
            behind — texture, light, geometry.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              hash="analyze"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary-dark"
            >
              Analyze Image
            </Link>
            <Link
              to="/about"
              hash="how"
              className="rounded-xl bg-frost/70 px-5 py-3 text-sm font-medium ring-1 ring-foreground/5 transition-colors hover:bg-frost"
            >
              See how it works
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
            <span>probabilistic scoring</span>
            <span className="size-1 rounded-full bg-border" />
            <span>Grad-CAM trace</span>
            <span className="size-1 rounded-full bg-border" />
            <span>session-only</span>
          </div>
        </div>

        <div className="relative rise-in">
          <div className="pointer-events-none absolute -inset-4 rounded-[28px] bg-primary/10 blur-2xl" />
          <div className="relative rounded-[24px] bg-frost/70 p-3 shadow-plate ring-1 ring-foreground/5 backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[18px]">
              <img
                src={heroPlate}
                alt="Surveillance frame of a person in a corridor being examined by SignalScope"
                width={1024}
                height={640}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="sweep-bar absolute bottom-0 top-0 w-1/5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
