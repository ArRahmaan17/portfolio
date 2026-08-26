import { Clock3, ShieldAlert, Sparkles, Wrench } from "lucide-react";

export default function Maintenance() {
  const heading = process.env.REACT_APP_MAINTENANCE_TITLE || "We're under maintenance";
  const message =
    process.env.REACT_APP_MAINTENANCE_MESSAGE ||
    "The portfolio is temporarily unavailable while we roll out improvements. Please check back soon.";

  return (
    <div className="min-h-screen overflow-hidden bg-void px-6 py-10 text-cloud">
      {/* Signal-field static background (no WebGL on maintenance page) */}
      <div className="pointer-events-none fixed inset-0 bg-signal-field opacity-60" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Main card */}
          <section className="glass-panel relative overflow-hidden p-8 sm:p-10 border-white/10">
            <div className="absolute -left-20 top-8 h-52 w-52 rounded-full bg-ion/10 blur-3xl" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-electric/10 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                <ShieldAlert className="h-3.5 w-3.5" />
                Maintenance mode
              </div>

              <h1 className="font-display mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-cloud">
                {heading}
              </h1>

              <p className="font-body mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {message}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Updates", "Deploying a cleaner experience"],
                  ["Access", "Back soon after the rollout"],
                  ["Status", "Monitoring the deployment"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</div>
                    <div className="font-body mt-2 text-sm font-medium text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Aside */}
          <aside className="glass-panel p-6 sm:p-8 border-white/10 dark:bg-panel/80">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-electric text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-cloud">Service pause</h2>
                <p className="font-body text-sm text-white/60">The site will return when the maintenance build is complete.</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {[
                "New features incoming",
                "Content refresh",
                "Admin panel polish",
                "Performance tweaks",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-ion" />
                    <span className="font-body text-sm font-medium text-white">{item}</span>
                  </div>
                  <Clock3 className="h-4 w-4 text-white/40" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
