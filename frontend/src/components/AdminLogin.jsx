import { useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { ADMIN_LOGIN_URL } from "../constants";

export default function AdminLogin({ theme = "Light", changeTheme }) {
  const [form, setForm] = useState({ email: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isDark = theme === "Dark";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
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
      if (!response.ok) {
        throw new Error(
          payload.message || `Login failed with status ${response.status}`,
        );
      }

      if (!payload.token) {
        throw new Error("Login response missing token");
      }

      localStorage.setItem("admin_token", payload.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_32%),linear-gradient(180deg,_#f8fafc,_#eef2ff_55%,_#f8fafc)] px-6 py-8 text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(180deg,_#020617,_#020617_55%,_#0f172a)] dark:text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl sm:max-w-3xl lg:max-w-lg items-center gap-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 text-slate-950 shadow-2xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-950/90 dark:text-white dark:shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div class="flex-grow">
              <h2 className="text-2xl font-semibold">Admin Login</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter the credentials used for the single admin account.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900"
              >
                {isDark ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
                {isDark ? "Light" : "Dark"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@site.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Admin password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                This must match the admin password stored in the backend.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {loading ? "Signing in..." : "Enter dashboard"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
