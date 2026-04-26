import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, FolderKanban, MessageSquare, RefreshCw, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";

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
    if (!token) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [skillsPayload, portfoliosPayload, messagesPayload] = await Promise.all([
          adminApi.skills.list(token),
          adminApi.portfolios.list(token),
          adminApi.messages.list(token),
        ]);

        if (cancelled) {
          return;
        }

        const skills = Array.isArray(skillsPayload.skills) ? skillsPayload.skills : [];
        const portfolios = Array.isArray(portfoliosPayload.portfolios) ? portfoliosPayload.portfolios : [];
        const messages = Array.isArray(messagesPayload.data) ? messagesPayload.data : [];

        setSkillsCount(skills.length);
        setPortfoliosCount(portfolios.length);
        setMessagesCount(messages.length);
        setRecentMessages(messages.slice(0, 5));
        setLastLoadedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="relative isolate overflow-hidden px-6 py-8 sm:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)]" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin overview
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Keep the portfolio current without leaving this panel.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Monitor the state of your content, jump into the editor screens, and catch new messages before they go stale.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <a
                href="/admin/skills"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open editor
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Skills",
            value: skillsCount,
            description: "Stacks currently published",
            icon: Wrench,
            accent: "from-sky-500 to-cyan-400",
          },
          {
            label: "Portfolios",
            value: portfoliosCount,
            description: "Projects shown on the site",
            icon: FolderKanban,
            accent: "from-violet-500 to-fuchsia-400",
          },
          {
            label: "Messages",
            value: messagesCount,
            description: "Contact inquiries in inbox",
            icon: MessageSquare,
            accent: "from-emerald-500 to-lime-400",
          },
        ].map(({ label, value, description, icon: Icon, accent }) => (
          <article
            key={label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <div className="mt-3 text-4xl font-semibold tracking-tight">{value}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Recent messages</p>
              <h2 className="mt-2 text-xl font-semibold">Latest contact submissions</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-300">
              {lastLoadedAt ? `Updated ${lastLoadedAt}` : "Loading..."}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
                  />
                ))}
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
                <div>
                  <Activity className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">No messages yet</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Once visitors start using the contact form, new messages will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="truncate text-sm font-semibold">{msg.fullName}</h3>
                          <span className="text-xs text-slate-500">{msg.email}</span>
                        </div>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {msg.message}
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-slate-500">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Quick actions</p>
          <div className="mt-4 space-y-3">
            {[
              ["Manage skills", "/admin/skills"],
              ["Manage portfolios", "/admin/portfolios"],
              ["Review messages", "/admin/messages"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:hover:bg-slate-900"
              >
                <span>{label}</span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              <Sparkles className="h-4 w-4" />
              Focus
            </div>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Keep the dashboard lean: use the overview for status and the editor pages for content changes.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
