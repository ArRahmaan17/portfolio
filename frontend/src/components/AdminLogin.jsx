import { useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { ADMIN_LOGIN_URL } from "../constants";

export default function AdminLogin({ theme = "Light", changeTheme }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isDark = theme === "Dark";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleToggleTheme = async () => {
    if (!changeTheme) return;
    await changeTheme(isDark ? "Light" : "Dark");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(ADMIN_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `Login failed with status ${response.status}`);
      if (!payload.token) throw new Error("Login response missing token");

      localStorage.setItem("admin_token", payload.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-950 outline-none transition focus:border-primary focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:placeholder:text-slate-500 dark:focus:bg-white/10";

  return (
    <div className="min-h-screen overflow-hidden bg-cloud/20 dark:bg-void px-6 py-8">
      <div className="pointer-events-none fixed inset-0 bg-signal-field opacity-30 dark:opacity-60" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="glass-panel p-8 bg-white/80 dark:bg-panel/80 border-white/20 dark:border-white/10 shadow-2xl shadow-slate-300/20 dark:shadow-black/40">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-contrast shadow-lg shadow-primary/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <h1 className="font-display text-2xl font-bold dark:text-cloud text-slate-900">Admin Login</h1>
              <p className="font-body text-sm text-slate-500 dark:text-slate-400">
                Enter your admin credentials to continue.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 font-mono text-xs font-semibold text-slate-900 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-cloud dark:hover:bg-white/20"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {isDark ? "Light" : "Dark"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <label className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="admin-email"
                placeholder="admin@site.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="grid gap-1.5">
              <label className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="admin-password"
                placeholder="Admin password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className={inputClass}
              />
              <p className="font-body text-xs leading-5 text-slate-500 dark:text-slate-400">
                This must match the admin password stored in the backend.
              </p>
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 font-body text-sm font-semibold text-primary-contrast shadow-lg shadow-primary/30 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Enter dashboard"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
