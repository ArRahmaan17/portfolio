import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";
import {
  BLOG_CONTENT_MAX_LENGTH,
  markdownToHtml,
  markdownToPlainText,
} from "../../utils/markdown";

const INITIAL_FORM = {
  title: "",
  content: "",
  slug: "",
  published_at: "",
};

export default function AdminBlogs() {
  const { t } = useTranslation();
  const token = useMemo(() => requireAdminToken(), []);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [query, setQuery] = useState("");

  const loadAll = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.blogs.list(token);
      setBlogs(Array.isArray(payload.blogs) ? payload.blogs : []);
    } catch (err) {
      setError(err?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "content" && value.length > BLOG_CONTENT_MAX_LENGTH) {
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      slug: blog.slug || "",
      published_at: blog.published_at ? new Date(blog.published_at).toISOString().split('T')[0] : "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const body = {
        title: form.title,
        content: form.content,
        slug: form.slug || undefined,
        published_at: form.published_at || null,
      };

      if (editing) {
        await adminApi.blogs.update(token, editing.id, body);
      } else {
        await adminApi.blogs.create(token, body);
      }

      cancelEdit();
      await loadAll();
    } catch (err) {
      setError(err?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blog) => {
    if (!token) return;
    const ok = window.confirm(`Are you sure you want to delete "${blog.title}"?`);
    if (!ok) return;

    setLoading(true);
    setError("");
    try {
      await adminApi.blogs.remove(token, blog.id);
      await loadAll();
    } catch (err) {
      setError(err?.message || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const haystack = `${blog.title ?? ""} ${blog.content ?? ""} ${blog.slug ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });
  const contentLength = form.content.length;
  const contentLimitReached = contentLength >= BLOG_CONTENT_MAX_LENGTH;

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Blog Manager
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Blogs
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Manage your blog posts here. You can create, edit, and delete articles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadAll}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:hover:bg-slate-950 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
            >
              <RefreshCw className="h-4 w-4" />
              {t("admin.common.refresh")}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {editing ? "Edit Blog" : "Create Blog"}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {editing ? editing.title : "Add New Post"}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Slug (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-title"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Published Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="published_at"
                  type="date"
                  value={form.published_at}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Content
                </label>
                <span
                  className={`text-xs font-semibold ${
                    contentLimitReached ? "text-amber-600 dark:text-amber-400" : "text-slate-500"
                  }`}
                >
                  {contentLength.toLocaleString()} / {BLOG_CONTENT_MAX_LENGTH.toLocaleString()}
                </span>
              </div>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                maxLength={BLOG_CONTENT_MAX_LENGTH}
                placeholder="Write your blog content here..."
                rows={10}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Markdown supported: headings, bold, italic, links, lists, quotes, and code blocks.
              </p>
              {contentLimitReached && (
                <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Content has reached the maximum allowed length.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Preview
              </label>
              <div
                className="markdown-content prose prose-sm max-w-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:prose-invert dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: form.content
                    ? markdownToHtml(form.content)
                    : "<p>Markdown preview will appear here.</p>",
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editing ? "Update Blog" : "Create Blog"}
              <ArrowRight className="h-4 w-4" />
            </button>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {t("admin.common.cancel")}
              </button>
            )}
          </div>
        </form>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                All Posts
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {filteredBlogs.length} Published
              </h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blogs..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:dark:dark:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-5 max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            {loading && blogs.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">
                Loading...
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="grid min-h-48 place-items-center bg-slate-50 px-6 py-10 text-center dark:bg-slate-900/40">
                <div>
                  <BookOpen className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">
                    No blogs found
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredBlogs.map((blog) => (
                  <li key={blog.id} className="bg-white p-4 dark:bg-slate-950">
                    <div className="flex flex-col gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {blog.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                          {markdownToPlainText(blog.content)}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          <span className="flex items-center gap-1">
                             <LinkIcon className="h-3 w-3" /> {blog.slug}
                          </span>
                          {blog.published_at && (
                             <span className="flex items-center gap-1">
                               <Calendar className="h-3 w-3" /> {new Date(blog.published_at).toLocaleDateString()}
                             </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(blog)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {t("admin.common.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t("admin.common.delete")}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
