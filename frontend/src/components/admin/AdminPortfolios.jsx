import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  FolderKanban,
  ImagePlus,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";
import { backendAssetUrl } from "../../constants";

const INITIAL_FORM = {
  name: "",
  description: "",
  link: "",
  picture: null,
  stacks: [],
};

export default function AdminPortfolios() {
  const { t } = useTranslation();
  const token = useMemo(() => requireAdminToken(), []);
  const [portfolios, setPortfolios] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [query, setQuery] = useState("");
  const [stackQuery, setStackQuery] = useState("");

  const loadAll = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [portfoliosPayload, skillsPayload] = await Promise.all([
        adminApi.portfolios.list(token),
        adminApi.skills.list(token),
      ]);

      setPortfolios(
        Array.isArray(portfoliosPayload.portfolios)
          ? portfoliosPayload.portfolios
          : [],
      );
      setSkills(
        Array.isArray(skillsPayload.skills) ? skillsPayload.skills : [],
      );
    } catch (err) {
      setError(err?.message || t("admin.portfolios.error_load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setForm((current) => ({ ...current, picture: files?.[0] || null }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleStack = (skillId) => {
    setForm((current) => {
      const exists = current.stacks.includes(skillId);
      return {
        ...current,
        stacks: exists
          ? current.stacks.filter((id) => id !== skillId)
          : [...current.stacks, skillId],
      };
    });
  };

  const startEdit = (portfolio) => {
    const attachedSkills = portfolio.Skills ?? portfolio.skills ?? [];
    const stackIds = Array.isArray(attachedSkills)
      ? attachedSkills.map((s) => s.id).filter(Boolean)
      : [];

    setEditing(portfolio);
    setForm({
      name: portfolio.name || "",
      description: portfolio.description || "",
      link: portfolio.link || "",
      picture: null,
      stacks: stackIds,
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
      formData.append("link", form.link);
      formData.append("stacks", JSON.stringify(form.stacks));
      if (form.picture) {
        formData.append("picture", form.picture);
      }

      if (editing) {
        await adminApi.portfolios.update(token, editing.id, formData);
      } else {
        if (!form.picture) {
          throw new Error("picture is required");
        }
        await adminApi.portfolios.create(token, formData);
      }

      cancelEdit();
      await loadAll();
    } catch (err) {
      setError(err?.message || t("admin.portfolios.error_save"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (portfolio) => {
    if (!token) return;
    const ok = window.confirm(
      t("admin.portfolios.confirm_delete", { name: portfolio.name }),
    );
    if (!ok) return;

    setLoading(true);
    setError("");
    try {
      await adminApi.portfolios.remove(token, portfolio.id);
      await loadAll();
    } catch (err) {
      setError(err?.message || t("admin.portfolios.error_delete"));
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const skillNames = (portfolio.Skills ?? portfolio.skills ?? [])
      .map((skill) => skill.name ?? "")
      .join(" ");
    const haystack =
      `${portfolio.name ?? ""} ${portfolio.description ?? ""} ${portfolio.link ?? ""} ${skillNames}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const filteredSkills = skills.filter((skill) => {
    const haystack =
      `${skill.name ?? ""} ${skill.description ?? ""}`.toLowerCase();
    return haystack.includes(stackQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row  lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("admin.portfolios.manager")}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("admin.portfolios.title")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t("admin.portfolios.subtitle")}
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

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {editing
                  ? t("admin.portfolios.edit")
                  : t("admin.portfolios.create")}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {editing ? editing.name : t("admin.portfolios.add_card")}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("admin.common.name")}
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("admin.portfolios.placeholder_name")}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("admin.common.description")}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t("admin.portfolios.placeholder_description")}
                rows={5}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("admin.portfolios.project_link")}
              </label>
              <input
                name="link"
                type="url"
                value={form.link}
                onChange={handleChange}
                placeholder={t("admin.portfolios.placeholder_link")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("admin.portfolios.project_image")}
              </label>
              <input
                name="picture"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleChange}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              />
              <p className="mt-2 text-xs text-slate-500">
                {t("admin.portfolios.image_hint")}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("admin.common.stacks")}
                </label>
                <span className="text-xs text-slate-400">
                  {t("admin.common.selected_count", {
                    count: form.stacks.length,
                  })}
                </span>
              </div>
              <div className="mb-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={stackQuery}
                    onChange={(e) => setStackQuery(e.target.value)}
                    placeholder={t("admin.common.search_stacks")}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="max-h-[55vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filteredSkills.map((skill) => {
                    const selected = form.stacks.includes(skill.id);
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => toggleStack(skill.id)}
                        className={`flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${
                          selected
                            ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                            : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="truncate">{skill.name}</span>
                        <span className="text-xs opacity-70">
                          {selected
                            ? t("admin.common.selected")
                            : t("admin.common.add")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editing
                ? t("admin.portfolios.update")
                : t("admin.portfolios.create")}
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
                {t("admin.portfolios.all")}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {t("admin.portfolios.published_count", {
                  count: filteredPortfolios.length,
                })}
              </h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("admin.portfolios.search")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:dark:dark:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-5 max-h-[87vh] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            {loading && portfolios.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">
                {t("admin.portfolios.loading")}
              </div>
            ) : filteredPortfolios.length === 0 ? (
              <div className="grid min-h-48 place-items-center bg-slate-50 px-6 py-10 text-center dark:bg-slate-900/40">
                <div>
                  <ImagePlus className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">
                    {t("admin.portfolios.no_match")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("admin.portfolios.no_match_hint")}
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredPortfolios.map((portfolio) => {
                  const attachedSkills =
                    portfolio.Skills ?? portfolio.skills ?? [];
                  const stackNames = Array.isArray(attachedSkills)
                    ? attachedSkills.map((s) => s.name).filter(Boolean)
                    : [];

                  return (
                    <li
                      key={portfolio.id}
                      className="bg-white p-4 dark:bg-slate-950"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                            {portfolio.picture ? (
                              <img
                                alt={portfolio.name}
                                src={backendAssetUrl(portfolio.picture)}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-slate-400">
                                <ImagePlus className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">
                              {portfolio.name}
                            </div>
                            <div className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                              {portfolio.description}
                            </div>
                            {portfolio.link && (
                              <a
                                href={portfolio.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block truncate text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {portfolio.link}
                              </a>
                            )}
                            {stackNames.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {stackNames.map((name) => (
                                  <span
                                    key={`${portfolio.id}-${name}`}
                                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(portfolio)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {t("admin.common.edit")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(portfolio)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("admin.common.delete")}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
