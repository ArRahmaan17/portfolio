import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Github,
  Send,
} from "lucide-react";
import { z } from "zod";
import { MESSAGES_URL } from "../constants";
import AnimatedContent from "./react-bits/AnimatedContent";
import ElectricBorder from "./react-bits/ElectricBorder";

const INITIAL_FORM = { name: "", email: "", message: "" };
const FIELD_ORDER = ["name", "email", "message"];

function createContactSchema(t) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: t("contact_section.validation.name_required") })
      .min(2, { error: t("contact_section.validation.name_short") })
      .max(100, { error: t("contact_section.validation.name_long") }),
    email: z
      .string()
      .trim()
      .min(1, { error: t("contact_section.validation.email_required") })
      .max(254, { error: t("contact_section.validation.email_long") })
      .pipe(z.email({ error: t("contact_section.validation.email_invalid") })),
    message: z
      .string()
      .trim()
      .min(1, { error: t("contact_section.validation.message_required") })
      .min(10, { error: t("contact_section.validation.message_short") })
      .max(2000, { error: t("contact_section.validation.message_long") }),
  });
}

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);
    setError("");

    const validation = createContactSchema(t).safeParse(form);
    if (!validation.success) {
      const flattened = z.flattenError(validation.error);
      const nextFieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors).map(([field, messages]) => [
          field,
          messages[0],
        ]),
      );
      setFieldErrors(nextFieldErrors);

      const firstInvalidField = FIELD_ORDER.find(
        (field) => nextFieldErrors[field],
      );
      if (firstInvalidField) {
        window.requestAnimationFrame(() => {
          document.getElementById(`contact-${firstInvalidField}`)?.focus();
        });
      }
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const response = await fetch(MESSAGES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: validation.data.name,
          email: validation.data.email,
          message: validation.data.message,
        }),
      });
      if (!response.ok)
        throw new Error(
          `Contact request failed with status ${response.status}`,
        );
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError?.message ||
          t("contact_section.error", {
            defaultValue: "The message could not be sent. Please try again.",
          }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-shell border-t border-slate-200/70 bg-slate-50/75 dark:border-white/5 dark:bg-panel/35"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <AnimatedContent>
          <p className="section-kicker">{t("contact")}</p>
          <h2 className="section-title max-w-xl">
            {t("contact_section.title", {
              defaultValue: "Let’s make the next useful thing.",
            })}
          </h2>
          <p className="section-copy max-w-lg">{t("short_contact")}</p>

          <div className="mt-12 border-t border-slate-200 pt-6 dark:border-white/10">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">
              See the code
            </p>
            <a
              href="https://github.com/ArRahmaan17"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-900 transition hover:text-primary dark:text-cloud"
            >
              <Github className="h-4 w-4" /> github.com/ArRahmaan17{" "}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </AnimatedContent>

        <AnimatedContent from="right" delay={0.1}>
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.6)] dark:border-white/10 dark:bg-panel/80 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-field">
                  <span>{t("name")}</span>
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? "contact-name-error" : undefined
                    }
                    placeholder={t("contact_section.name_placeholder", {
                      defaultValue: "How should I address you?",
                    })}
                  />
                  {fieldErrors.name ? (
                    <p
                      id="contact-name-error"
                      className="font-body text-xs leading-5 text-red-600 dark:text-red-400"
                    >
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </label>
                <label className="form-field">
                  <span>{t("email")}</span>
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "contact-email-error" : undefined
                    }
                    placeholder="you@company.com"
                  />
                  {fieldErrors.email ? (
                    <p
                      id="contact-email-error"
                      className="font-body text-xs leading-5 text-red-600 dark:text-red-400"
                    >
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </label>
              </div>
              <label className="form-field">
                <span>{t("message")}</span>
                <textarea
                  name="message"
                  id="contact-message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "contact-message-error" : undefined
                  }
                  placeholder={t("contact_section.message_placeholder", {
                    defaultValue:
                      "Tell me about the problem, the people using it, and what success looks like.",
                  })}
                />
                {fieldErrors.message ? (
                  <p
                    id="contact-message-error"
                    className="font-body text-xs leading-5 text-red-600 dark:text-red-400"
                  >
                    {fieldErrors.message}
                  </p>
                ) : null}
              </label>

              <ElectricBorder radius="1rem">
                <button
                  type="submit"
                  disabled={loading}
                  id="contact-submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-body text-sm font-semibold text-primary-contrast shadow-lg shadow-primary/25 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {loading
                    ? t("contact_section.sending", { defaultValue: "Sending…" })
                    : t("send")}
                </button>
              </ElectricBorder>

              <div aria-live="polite">
                {success ? (
                  <div className="form-notice border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    {t("message_sent")}
                  </div>
                ) : null}
                {error ? (
                  <div className="form-notice border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
