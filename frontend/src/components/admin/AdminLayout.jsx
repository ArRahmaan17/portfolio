import { useEffect, useMemo } from "react";
import {
  Activity, BookOpen, FolderKanban, Languages, LayoutDashboard,
  LogOut, MessagesSquare, Moon, ShieldCheck, Sun, Users, Wrench, Menu,
} from "lucide-react";
import { requireAdminToken } from "../../utils/adminApi";
import { useState } from "react";

export default function AdminLayout({ children, theme = "Light", changeTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    requireAdminToken();
  }, []);

  const navigation = useMemo(
    () => [
      { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
      { href: "/admin/skills",       label: "Skills",       icon: Wrench },
      { href: "/admin/portfolios",   label: "Portfolios",   icon: FolderKanban },
      { href: "/admin/blogs",        label: "Blogs",        icon: BookOpen },
      { href: "/admin/messages",     label: "Messages",     icon: MessagesSquare },
      { href: "/admin/localizations",label: "Localizations",icon: Languages },
      { href: "/admin/employees",    label: "Employees",    icon: Users },
    ],
    []
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

  const Sidebar = ({ onClose }) => (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/90 shadow-2xl shadow-slate-200/30 backdrop-blur-xl dark:bg-panel/90 dark:shadow-black/40">
      {/* Brand */}
      <div className="border-b border-slate-200/80 px-5 py-5 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-electric text-white shadow-lg shadow-electric/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-bold dark:text-cloud text-slate-900">Admin</div>
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400">Control panel</div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden">
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4" aria-label="Admin navigation">
        <div className="mb-3 flex items-center gap-2 px-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
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
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-body text-sm font-medium transition-all ${
                  active
                    ? "bg-electric text-white shadow-lg shadow-electric/25"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
                {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-ion animate-electric-pulse" />}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-2 border-t border-slate-200/80 p-4 dark:border-white/10">
        <button
          type="button"
          onClick={handleToggleTheme}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-body text-sm font-semibold transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:hover:bg-white/10"
        >
          {isDark ? <Sun className="h-4 w-4 text-ion" /> : <Moon className="h-4 w-4 text-electric" />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric px-4 py-2.5 font-body text-sm font-semibold text-white shadow-sm shadow-electric/20 transition hover:bg-violet-500"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cloud/20 dark:bg-void">
      <div className="pointer-events-none fixed inset-0 bg-signal-field opacity-20 dark:opacity-40" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[96rem] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6 xl:px-10">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72 lg:shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Sidebar">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 p-4">
              <Sidebar onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="relative min-w-0 flex-1">
          {/* Mobile topbar */}
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-panel/80 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 font-mono text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-cloud dark:hover:bg-white/20"
              aria-label="Open sidebar"
            >
              <Menu className="h-4 w-4" /> Menu
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs font-semibold transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-cloud"
              >
                {isDark ? <Sun className="h-3.5 w-3.5 text-ion" /> : <Moon className="h-3.5 w-3.5 text-electric" />}
                {isDark ? "Light" : "Dark"}
              </button>
              <div className="rounded-full bg-electric px-3 py-1 font-mono text-xs font-semibold text-white">
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
