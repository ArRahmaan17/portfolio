import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, RefreshCw, Search, ShieldCheck, Trash2, Wrench, Pencil } from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";
import { backendAssetUrl } from "../../constants";
const INITIAL_FORM = {
  name: "",
  description: "",
  start_date: "",
  icon: null,
};

export default function AdminSkills() {
  const token = useMemo(() => requireAdminToken(), []);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [query, setQuery] = useState("");

  const loadSkills = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.skills.list(token);
      setSkills(Array.isArray(payload.skills) ? payload.skills : []);
    } catch (err) {
      setError(err?.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "icon") {
      setForm((current) => ({ ...current, icon: files?.[0] || null }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (skill) => {
    setEditing(skill);
    setForm({
      name: skill.name || "",
      description: skill.description || "",
      start_date: skill.start_date ? String(skill.start_date).slice(0, 10) : "",
      icon: null,
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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("start_date", form.start_date);
      if (form.icon) {
        formData.append("icon", form.icon);
      }

      if (editing) {
        await adminApi.skills.update(token, editing.id, formData);
      } else {
        if (!form.icon) {
          throw new Error("icon is required");
        }
        await adminApi.skills.create(token, formData);
      }

      cancelEdit();
      await loadSkills();
    } catch (err) {
      setError(err?.message || "Failed to save skill");
    } finally {
      setLoading(false);
      setForm(INITIAL_FORM);
    }
  };

  const handleDelete = async (skill) => {
    if (!token) return;
    const ok = window.confirm(`Delete skill "${skill.name}"?`);
    if (!ok) return;

    setLoading(true);
    setError("");
    try {
      await adminApi.skills.remove(token, skill.id);
      await loadSkills();
    } catch (err) {
      setError(err?.message || "Failed to delete skill");
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter((skill) => {
    const haystack = `${skill.name ?? ""} ${skill.description ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between ">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Content manager
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Skills</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Keep the stack list current with clear descriptions, dates, and SVG icons for each skill.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadSkills}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              New skill
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {editing ? "Edit skill" : "Create skill"}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {editing ? editing.name : "Add a new stack item"}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Wrench className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="React JS"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Frontend library used for interactive UI"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Start date
              </label>
              <input
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                type="date"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                SVG icon
              </label>
              <input
                name="icon"
                type="file"
                accept="image/svg+xml"
                onChange={handleChange}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              />
              <p className="mt-2 text-xs text-slate-500">
                Leave empty when updating unless you want to replace the current icon.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editing ? "Update skill" : "Create skill"}
              <ArrowRight className="h-4 w-4" />
            </button>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">All skills</p>
              <h2 className="mt-2 text-xl font-semibold">{filteredSkills.length} published</h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-5 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            {loading && skills.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">Loading skills...</div>
            ) : filteredSkills.length === 0 ? (
              <div className="grid min-h-48 place-items-center bg-slate-50 px-6 py-10 text-center dark:bg-slate-900/40">
                <div>
                  <Plus className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">No matching skills</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Clear the search or create a new skill to add it to the stack.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredSkills.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex flex-col gap-4 bg-white p-4 transition hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                        {skill.icon ? (
                          <img alt={skill.name} src={backendAssetUrl(skill.icon)} className="h-8 w-8" />
                        ) : (
                          <Wrench className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{skill.name}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {skill.description}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {skill.start_date ? new Date(skill.start_date).toLocaleDateString() : "No start date"}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(skill)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(skill)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
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
