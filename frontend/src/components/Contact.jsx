import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MESSAGES_URL } from "../constants";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import AnimatedContent from "./react-bits/AnimatedContent";
import ElectricBorder from "./react-bits/ElectricBorder";

const INITIAL_FORM = { name: "", email: "", message: "" };

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch(MESSAGES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: form.name, email: form.email, message: form.message }),
      });

      if (!response.ok) throw new Error(`Contact request failed with status ${response.status}`);

      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error(err);
      setError(err?.message || t("An error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-body text-sm text-slate-900 outline-none backdrop-blur-sm transition focus:border-electric focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:placeholder:text-slate-500 dark:focus:border-ion dark:focus:bg-white/10";

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 lg:px-8 lg:py-36 dark:bg-panel/60 bg-slate-50">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-signal-field opacity-30 dark:opacity-70" aria-hidden="true" />

      <div className="mx-auto max-w-2xl">
        <AnimatedContent>
          <h2 className="font-display text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-2 dark:text-cloud text-slate-900">
            {t("contact")}
          </h2>
          <p className="font-mono text-center text-sm uppercase tracking-widest text-ion mb-4">
            Get In Touch
          </p>
          <p className="font-body text-center text-base leading-relaxed text-slate-500 dark:text-slate-400 mb-12">
            {t("short_contact")}
          </p>
        </AnimatedContent>

        <AnimatedContent delay={0.15}>
          <div className="glass-panel p-8 bg-white/70 dark:bg-panel/80">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                id="contact-name"
                placeholder={t("name")}
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                id="contact-email"
                placeholder={t("email")}
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputClass}
              />
              <textarea
                name="message"
                id="contact-message"
                placeholder={t("message")}
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className={inputClass}
              />

              <ElectricBorder radius="1rem">
                <button
                  type="submit"
                  disabled={loading}
                  id="contact-submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric px-6 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-electric/30 transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Sending…" : t("send")}
                </button>
              </ElectricBorder>

              {success && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {t("message_sent") || "Message sent!"}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </form>
          </div>
        </AnimatedContent>

        <p className="mt-10 text-center font-mono text-xs text-slate-400">Since 2022</p>
      </div>
    </section>
  );
}
