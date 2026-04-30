import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import Navbar from "./Navbar";
import { BLOGS_URL } from "../constants/api";
import { markdownToHtml, markdownToPlainText } from "../utils/markdown";

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

        // Check if there's a slug in the URL
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedBlog(null);
    window.history.pushState({}, "", "/blog");
  };

  let params = {
    classNavbar: classNavbar,
    changeTheme: changeTheme,
    theme: theme,
    lang: lang,
    changeLanguage: changeLanguage,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-mono transition-colors duration-300">
      <Navbar {...params} />
      
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : selectedBlog ? (
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t("blog.back")}
            </button>
            
            <header className="mb-12">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(selectedBlog.published_at || selectedBlog.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {t("blog.read_time", { count: getReadMinutes(selectedBlog.content) })}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {selectedBlog.title}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"></div>
            </header>

            <div
              className="markdown-content prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedBlog.content) }}
            />
          </article>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="mb-16">
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {t("blog.heading_prefix")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  {t("blog.heading_highlight")}
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                {t("blog.subtitle")}
              </p>
            </div>

            {blogs.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">{t("blog.empty")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {blogs.map((blog) => (
                  <div 
                    key={blog.id}
                    onClick={() => handleBlogClick(blog)}
                    className="group relative flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.published_at || blog.createdAt)}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-4 mb-8 flex-grow leading-relaxed">
                        {markdownToPlainText(blog.content)}
                      </p>
                      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white group-hover:gap-2 transition-all">
                        {t("blog.read_more")}
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
