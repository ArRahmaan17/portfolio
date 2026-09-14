import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, X } from "lucide-react";

export default function CookieNotice() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("cookie_notice_accepted");
      if (!accepted) {
        setVisible(true);
      }
    } catch (_e) {
      // In case localStorage is blocked by private browsing
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem("cookie_notice_accepted", "true");
    } catch (_e) {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label={t("cookie_notice.title", {
        defaultValue: "Storage & Cookie Notice",
      })}
      className="fixed bottom-5 left-4 right-4 z-40 mx-auto max-w-xl animate-fade-in rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-panel/95 sm:bottom-6 sm:left-auto sm:right-6 sm:p-5"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="flex-1 pr-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-cloud">
              {t("cookie_notice.title", {
                defaultValue: "Storage & Cookie Notice",
              })}
            </h2>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss cookie notice"
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-1.5 font-body text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t("cookie_notice.message", {
              defaultValue:
                "This site uses local storage only to remember your theme and language preferences. No tracking pixels or advertising cookies are used.",
            })}{" "}
            <a
              href="/cookie-policy"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t("cookie_notice.learn_more", {
                defaultValue: "Learn more",
              })}
            </a>
            .
          </p>

          <div className="mt-3.5 flex justify-end">
            <button
              onClick={handleDismiss}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-2 font-body text-xs font-semibold text-primary-contrast shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-panel"
            >
              {t("cookie_notice.accept", { defaultValue: "Got it" })}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
