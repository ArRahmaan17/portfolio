import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ADMIN_LOGIN_URL } from "../constants";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
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
        throw new Error(payload.message || `Login failed with status ${response.status}`);
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
    <div className="min-h-screen overflow-hidden bg-white px-6 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl sm:max-w-3xl lg:max-w-lg items-center gap-8">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 text-slate-950 shadow-2xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Admin Login</h2>
              <p className="text-sm text-slate-500">
                Enter the credentials used for the single admin account.
              </p>
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
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
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
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
              />
              <p className="text-xs leading-5 text-slate-500">
                This must match the admin password stored in the backend.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
