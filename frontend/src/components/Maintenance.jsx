import { Clock3, ShieldAlert, Sparkles, Wrench } from "lucide-react";

export default function Maintenance() {
  const heading = process.env.REACT_APP_MAINTENANCE_TITLE || "We’re under maintenance";
  const message =
    process.env.REACT_APP_MAINTENANCE_MESSAGE ||
    "The portfolio is temporarily unavailable while we roll out improvements. Please check back soon.";

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.2),_transparent_28%),linear-gradient(135deg,_#020617,_#0f172a_48%,_#111827)] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
            <div className="absolute -left-20 top-8 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                <ShieldAlert className="h-3.5 w-3.5" />
                Maintenance mode
              </div>

              <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {heading}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                {message}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Updates", "Deploying a cleaner experience"],
                  ["Access", "Back soon after the rollout"],
                  ["Status", "Monitoring the deployment"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                      {label}
                    </div>
                    <div className="mt-2 text-sm font-medium text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[2.25rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-950">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Service pause</h2>
                <p className="text-sm text-white/65">The site will return when the maintenance build is complete.</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
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
                    <Sparkles className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium text-white">{item}</span>
                  </div>
                  <Clock3 className="h-4 w-4 text-white/45" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

