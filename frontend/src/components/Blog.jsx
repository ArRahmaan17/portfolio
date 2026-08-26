import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowUpRight, BookOpen, Calendar, Clock } from "lucide-react";
import { BLOGS_URL } from "../constants/api";
import { markdownToHtml, markdownToPlainText } from "../utils/markdown";
import AnimatedContent from "./react-bits/AnimatedContent";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Blog({ theme, changeTheme, lang, changeLanguage }) {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classNavbar, setClassNavbar] = useState("bg-transparent");
  const activeLocale = i18n.resolvedLanguage || lang || "en";

  const selectFromPath = useCallback((items) => {
    const slug = window.location.pathname.split("/")[2];
    setSelectedBlog(slug ? items.find((item) => item.slug === slug) || null : null);
  }, []);

  useEffect(() => {
    const handleScroll = () => setClassNavbar(window.pageYOffset > 25 ? "compact" : "bg-transparent");
    const handleHistory = () => selectFromPath(blogs);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handleHistory);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handleHistory);
    };
  }, [blogs, selectFromPath]);

  useEffect(() => {
    let cancelled = false;
    const fetchBlogs = async () => {
      try {
        const response = await fetch(BLOGS_URL);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `Failed to fetch blogs (${response.status})`);
        const items = Array.isArray(data.blogs) ? data.blogs : [];
        if (!cancelled) {
          setBlogs(items);
          selectFromPath(items);
        }
      } catch (requestError) {
        if (!cancelled) setError(t("blog.error_fetch"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBlogs();
    return () => { cancelled = true; };
  }, [selectFromPath, t]);

  const formatDate = (value) => value ? new Date(value).toLocaleDateString(activeLocale, { year: "numeric", month: "short", day: "numeric" }) : "Unpublished";
  const getReadMinutes = (content) => Math.max(1, Math.ceil(markdownToPlainText(content).trim().split(/\s+/).length / 220));

  const openBlog = (blog) => {
    setSelectedBlog(blog);
    window.history.pushState({}, "", `/blog/${blog.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeBlog = () => {
    setSelectedBlog(null);
    window.history.pushState({}, "", "/blog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navProps = { classNavbar, changeTheme, theme, lang, changeLanguage };

  return (
    <div className="min-h-screen bg-cloud/20 font-body transition-colors duration-300 dark:bg-void">
      <Navbar {...navProps} />
      <main className="px-5 pb-24 pt-36 sm:px-8 lg:px-12 lg:pt-44">
        {loading ? (
          <div className="mx-auto max-w-6xl space-y-5"><div className="h-40 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-white/5" />{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-52 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-white/5" />)}</div>
        ) : error ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div>
        ) : selectedBlog ? (
          <AnimatedContent className="mx-auto max-w-3xl">
            <article>
              <button onClick={closeBlog} className="secondary-action mb-12 !px-4 !py-2.5"><ArrowLeft className="h-4 w-4" />{t("blog.back")}</button>
              <header className="border-b border-slate-200 pb-10 dark:border-white/10">
                <p className="section-kicker">Field notes</p>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 dark:text-cloud sm:text-5xl lg:text-6xl">{selectedBlog.title}</h1>
                <div className="mt-7 flex flex-wrap gap-5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-slate-400">
                  <span className="inline-flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{formatDate(selectedBlog.published_at || selectedBlog.createdAt)}</span>
                  <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{t("blog.read_time", { count: getReadMinutes(selectedBlog.content) })}</span>
                </div>
              </header>
              <div className="markdown-content mt-12 text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedBlog.content) }} />
            </article>
          </AnimatedContent>
        ) : (
          <div className="mx-auto max-w-6xl">
            <AnimatedContent className="grid gap-8 border-b border-slate-200 pb-12 dark:border-white/10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div><p className="section-kicker">Field notes</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.055em] text-slate-950 dark:text-cloud sm:text-6xl">{t("blog.heading_prefix")} <span className="signal-gradient">{t("blog.heading_highlight")}</span></h1></div>
              <p className="max-w-xl font-body text-base leading-8 text-slate-600 dark:text-slate-400 lg:justify-self-end">{t("blog.subtitle")}</p>
            </AnimatedContent>

            {blogs.length === 0 ? (
              <div className="mt-12 grid min-h-72 place-items-center rounded-[2rem] border border-dashed border-slate-300 text-center dark:border-white/10"><div><BookOpen className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" /><p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t("blog.empty")}</p></div></div>
            ) : (
              <AnimatedContent className="mt-5 divide-y divide-slate-200 dark:divide-white/10" delay={0.08}>
                {blogs.map((blog, index) => (
                  <button key={blog.id} onClick={() => openBlog(blog)} className="group grid w-full gap-5 py-8 text-left transition sm:grid-cols-[3rem_1fr_auto] sm:items-start">
                    <span className="font-mono text-[0.66rem] text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="font-display text-2xl font-semibold tracking-tight text-slate-900 transition group-hover:text-primary dark:text-cloud">{blog.title}</span>
                      <span className="mt-3 block max-w-2xl font-body text-sm leading-6 text-slate-600 dark:text-slate-400">{markdownToPlainText(blog.content).slice(0, 180)}{markdownToPlainText(blog.content).length > 180 ? "…" : ""}</span>
                      <span className="mt-4 flex gap-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-slate-400"><span>{formatDate(blog.published_at || blog.createdAt)}</span><span>{getReadMinutes(blog.content)} min</span></span>
                    </span>
                    <span className="icon-action group-hover:border-primary group-hover:text-primary"><ArrowUpRight className="h-4 w-4" /></span>
                  </button>
                ))}
              </AnimatedContent>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
