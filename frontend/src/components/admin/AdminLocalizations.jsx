import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Languages, Pencil, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";

const INITIAL_FORM = {
  locale: "en",
  key: "",
  value: "",
};

export default function AdminLocalizations() {
  const token = useMemo(() => requireAdminToken(), []);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadRows = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.localizations.listFlat(token);
      setRows(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load localizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = (row) => {
    setForm({
      locale: row.locale || "en",
      key: row.key || "",
      value: row.value || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    try {
      await adminApi.localizations.upsert(token, {
        locale: form.locale.trim(),
        key: form.key.trim(),
        value: form.value,
      });
      await loadRows();
    } catch (err) {
      setError(err?.message || "Failed to save localization");
    } finally {
      setSaving(false);
    }
  };

  const filteredRows = rows.filter((row) => {
    const haystack = `${row.locale ?? ""} ${row.key ?? ""} ${row.value ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Translation manager
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Localizations</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Edit locale keys used by the frontend i18n hydrator from database records.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRows}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Upsert key</p>
              <h2 className="mt-2 text-xl font-semibold">Create or update localization</h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Languages className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Locale
              </label>
              <input
                name="locale"
                value={form.locale}
                onChange={handleChange}
                placeholder="en"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Key
              </label>
              <input
                name="key"
                value={form.key}
                onChange={handleChange}
                placeholder="admin.common.refresh"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Value
              </label>
              <textarea
                name="value"
                value={form.value}
                onChange={handleChange}
                rows={8}
                placeholder="Refresh"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {saving ? "Saving..." : "Save localization"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Localization rows</p>
              <h2 className="mt-2 text-xl font-semibold">{filteredRows.length} entries</h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search localizations"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:dark:dark:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-5 max-h-[62vh] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            {loading && rows.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">Loading localizations...</div>
            ) : filteredRows.length === 0 ? (
              <div className="grid min-h-48 place-items-center bg-slate-50 px-6 py-10 text-center dark:bg-slate-900/40">
                <div>
                  <Languages className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">No matching localization rows</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try another search query or add a new localization key.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredRows.map((row) => (
                  <li
                    key={`${row.locale}:${row.key}`}
                    className="flex flex-col gap-3 bg-white p-4 transition hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {row.locale}
                        </div>
                        <div className="mt-1 truncate text-sm font-semibold">{row.key}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{row.value}</p>
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
