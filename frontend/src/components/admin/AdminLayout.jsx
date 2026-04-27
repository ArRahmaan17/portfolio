import { useEffect, useMemo } from "react";
import {
  Activity,
  FolderKanban,
  Languages,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  Wrench,
} from "lucide-react";
import { requireAdminToken } from "../../utils/adminApi";

export default function AdminLayout({ children, theme = "Light", changeTheme }) {
  useEffect(() => {
    requireAdminToken();
  }, []);

  const navigation = useMemo(
    () => [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/skills", label: "Skills", icon: Wrench },
      { href: "/admin/portfolios", label: "Portfolios", icon: FolderKanban },
      { href: "/admin/messages", label: "Messages", icon: MessagesSquare },
      { href: "/admin/localizations", label: "Localizations", icon: Languages },
      { href: "/admin/employees", label: "Employees", icon: Users },
    ],
    [],
  );

  const currentPath = window.location.pathname;
  const isDark = theme === "Dark";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const handleToggleTheme = async () => {
    if (!changeTheme) return;
    await changeTheme(isDark ? "Light" : "Dark");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc,_#eef2ff_55%,_#f8fafc)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_#020617,_#020617_55%,_#0f172a)] dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[96rem] flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6 xl:px-10">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72 lg:shrink-0">
          <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 dark:shadow-black/30">
            <div className="border-b border-slate-200/80 px-5 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Admin</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Content control center
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-2 py-4">
              <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <Activity className="h-3.5 w-3.5" />
                Navigation
              </div>
              <div className="flex flex-col gap-1">
                {navigation.map(({ href, label, icon: Icon }) => {
                  const active = currentPath === href;

                  return (
                    <a
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            </nav>

            <div className="space-y-3 border-t border-slate-200/80 p-4 dark:border-slate-800">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Light mode" : "Dark mode"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 lg:hidden">
            <div>
              <div className="text-sm font-semibold">Admin</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Dashboard shell</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {isDark ? "Light" : "Dark"}
              </button>
              <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                Secure
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
