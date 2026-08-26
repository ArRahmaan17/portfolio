import { ArrowUp, Github } from "lucide-react";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/70 px-5 py-8 dark:border-white/5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-slate-900 dark:text-cloud">Ardhi Rahmaan</p>
          <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-slate-400">© {year} · {t("all_rights_reserved")}</p>
        </div>
        <div className="flex items-center gap-2">
          <a className="icon-action" href="https://github.com/ArRahmaan17" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github className="h-4 w-4" /></a>
          <button className="icon-action ml-2" onClick={() => scroll.scrollToTop()} aria-label="Back to top"><ArrowUp className="h-4 w-4" /></button>
        </div>
      </div>
    </footer>
  );
}
