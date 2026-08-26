import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, FolderKanban, MessageSquare, RefreshCw, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";
import SpotlightCard from "../react-bits/SpotlightCard";
import AnimatedContent from "../react-bits/AnimatedContent";

export default function AdminDashboard() {
  const [skillsCount, setSkillsCount] = useState(0);
  const [portfoliosCount, setPortfoliosCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastLoadedAt, setLastLoadedAt] = useState("");

  const token = useMemo(() => requireAdminToken(), []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [sp, pp, mp] = await Promise.all([
          adminApi.skills.list(token),
          adminApi.portfolios.list(token),
          adminApi.messages.list(token),
        ]);
        if (cancelled) return;
        const skills     = Array.isArray(sp.skills)     ? sp.skills     : [];
        const portfolios = Array.isArray(pp.portfolios) ? pp.portfolios : [];
        const messages   = Array.isArray(mp.data)       ? mp.data       : [];
        setSkillsCount(skills.length);
        setPortfoliosCount(portfolios.length);
        setMessagesCount(messages.length);
        setRecentMessages(messages.slice(0, 5));
        setLastLoadedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [token]);

  const metrics = [
    { label: "Skills",     value: skillsCount,     description: "Stacks published",        icon: Wrench,       spotlight: "rgba(85,230,255,0.10)" },
    { label: "Portfolios", value: portfoliosCount,  description: "Projects on site",         icon: FolderKanban, spotlight: "rgba(139,92,246,0.10)" },
    { label: "Messages",   value: messagesCount,    description: "Contact inquiries",        icon: MessageSquare,spotlight: "rgba(217,70,239,0.10)" },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* Hero banner */}
      <AnimatedContent>
        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:border-white/10 dark:bg-panel/80 dark:shadow-black/30">
          <div className="relative isolate overflow-hidden px-6 py-8 sm:px-8">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-signal-field opacity-30 dark:opacity-60" aria-hidden="true" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-electric backdrop-blur dark:border-white/10 dark:bg-panel/80 dark:text-ion">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin overview
                </div>
                <h1 className="font-display mt-4 text-2xl font-bold tracking-tight dark:text-cloud text-slate-900 sm:text-3xl">
                  Keep the portfolio current without leaving this panel.
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Monitor content state, jump into editor screens, and catch new messages before they go stale.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* Metric tiles */}
      <AnimatedContent delay={0.12}>
        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map(({ label, value, description, icon: Icon, spotlight }) => (
            <SpotlightCard key={label} className="border border-slate-200/70 dark:border-white/10 p-5" spotlightColor={spotlight}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
                  <div className="mt-3 font-display text-4xl font-bold dark:text-cloud text-slate-900">{loading ? "—" : value}</div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-electric/10 text-electric dark:text-ion">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </SpotlightCard>
          ))}
        </section>
      </AnimatedContent>

      {/* Recent messages + quick actions */}
      <AnimatedContent delay={0.2}>
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Messages */}
          <article className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-panel/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recent messages</p>
                <h2 className="mt-1 font-display text-lg font-bold dark:text-cloud text-slate-900">Latest contact submissions</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">
                {lastLoadedAt ? `Updated ${lastLoadedAt}` : "Loading…"}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="mt-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
                  ))}
                </div>
              ) : recentMessages.length === 0 ? (
                <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-white/10 dark:bg-white/5">
                  <div>
                    <Activity className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-500" />
                    <p className="mt-3 text-sm font-medium dark:text-slate-300">No messages yet</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Messages from the contact form will appear here.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-electric/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-ion/30"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h3 className="truncate text-sm font-semibold dark:text-cloud text-slate-900">{msg.fullName}</h3>
                            <span className="font-mono text-xs text-slate-500">{msg.email}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{msg.message}</p>
                        </div>
                        <time className="shrink-0 font-mono text-xs text-slate-400">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Quick actions */}
          <aside className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-panel/80">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quick actions</p>
            <div className="mt-4 space-y-2">
              {[
                ["Manage skills",    "/admin/skills"],
                ["Manage portfolios","/admin/portfolios"],
                ["Review messages",  "/admin/messages"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium transition hover:border-electric/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:hover:border-ion/30 dark:hover:bg-white/10"
                >
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-electric/10 dark:bg-electric/5 border border-electric/20 p-4">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-electric dark:text-ion">
                <Sparkles className="h-4 w-4" />
                Focus
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Use the overview for status and editor screens for content changes.
              </p>
            </div>
          </aside>
        </section>
      </AnimatedContent>
    </div>
  );
}
