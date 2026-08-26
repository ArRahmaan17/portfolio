import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import Navbar from "./Navbar";
import { BLOGS_URL } from "../constants/api";
import { markdownToHtml, markdownToPlainText } from "../utils/markdown";
import AnimatedContent from "./react-bits/AnimatedContent";

export default function Blog({ theme, changeTheme, lang, changeLanguage }) {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classNavbar, setClassNavbar] = useState("bg-transparent");
  const activeLocale = i18n.resolvedLanguage || lang || "en";

  const formatDate = (value) => new Date(value).toLocaleDateString(activeLocale);
  const getReadMinutes = (content) => Math.max(1, Math.ceil(String(content || "").length / 1000));

  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        setClassNavbar("rounded-full bg-white dark:bg-slate-800 bg-opacity-40 backdrop-blur-2xl");
      } else {
        setClassNavbar("bg-transparent");
      }
    };
    window.addEventListener("scroll", headerOffscreen);

    const fetchBlogs = async () => {
      try {
        const response = await fetch(BLOGS_URL);
        const data = await response.json();
        setBlogs(data.blogs || []);
        const pathParts = window.location.pathname.split("/");
        if (pathParts.length > 2 && pathParts[2]) {
          const slug = pathParts[2];
          const blog = (data.blogs || []).find((b) => b.slug === slug);
          if (blog) setSelectedBlog(blog);
        }
      } catch (err) {
        setError(t("blog.error_fetch"));
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();

    return () => window.removeEventListener("scroll", headerOffscreen);
  }, [t]);

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    window.history.pushState({}, "", `/blog/${blog.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedBlog(null);
    window.history.pushState({}, "", "/blog");
  };

  const navParams = { classNavbar, changeTheme, theme, lang, changeLanguage };

  return (
    <div className="min-h-screen bg-cloud/20 dark:bg-void transition-colors duration-300 font-body">
      <Navbar {...navParams} />

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-electric border-t-transparent" />
          </div>
        ) : error ? (
          <AnimatedContent>
            <div className="py-10 text-center font-body text-red-500 dark:text-red-400">{error}</div>
          </AnimatedContent>
        ) : selectedBlog ? (
          <AnimatedContent>
            <article>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 font-body text-sm text-slate-500 hover:text-electric dark:hover:text-ion transition-colors mb-10 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                {t("blog.back")}
              </button>

              <header className="mb-12">
                <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedBlog.published_at || selectedBlog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t("blog.read_time", { count: getReadMinutes(selectedBlog.content) })}
                  </span>
                </div>
                <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl dark:text-cloud text-slate-900 mb-6 leading-tight">
                  {selectedBlog.title}
                </h1>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-ion via-electric to-plasma" />
              </header>

              <div
                className="markdown-content prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedBlog.content) }}
              />
            </article>
          </AnimatedContent>
        ) : (
          <AnimatedContent>
            <div className="mb-16">
              <h1 className="font-display text-5xl font-bold tracking-tight dark:text-cloud text-slate-900 mb-4">
                {t("blog.heading_prefix")}{" "}
                <span className="signal-gradient">{t("blog.heading_highlight")}</span>
              </h1>
              <p className="font-body text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                {t("blog.subtitle")}
              </p>
            </div>

            {blogs.length === 0 ? (
              <div className="glass-panel flex flex-col items-center justify-center py-24 bg-white/60 dark:bg-panel/60">
                <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="font-body text-slate-500 dark:text-slate-400">{t("blog.empty")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {blogs.map((blog) => (
                  <button
                    key={blog.id}
                    onClick={() => handleBlogClick(blog)}
                    className="group text-left w-full glass-panel p-8 bg-white/70 dark:bg-panel/70 transition-all hover:shadow-2xl hover:shadow-electric/10 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-4">
                      <Calendar className="h-3 w-3" />
                      {formatDate(blog.published_at || blog.createdAt)}
                    </div>
                    <h2 className="font-display text-xl font-bold dark:text-cloud text-slate-900 mb-4 group-hover:text-electric dark:group-hover:text-ion transition-colors">
                      {blog.title}
                    </h2>
                    <p className="font-body text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {markdownToPlainText(blog.content)}
                    </p>
                    <div className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-electric dark:text-ion group-hover:gap-2 transition-all">
                      {t("blog.read_more")}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </AnimatedContent>
        )}
      </main>
    </div>
  );
}
