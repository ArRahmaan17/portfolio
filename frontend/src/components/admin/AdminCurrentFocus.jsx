import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Crosshair, Edit3, Eye, EyeOff, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";
import AnimatedContent from "../react-bits/AnimatedContent";
import SpotlightCard from "../react-bits/SpotlightCard";

const INITIAL_FORM = {
  key: "",
  title_en: "",
  title_id: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminCurrentFocus() {
  const token = useMemo(() => requireAdminToken(), []);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.currentFocus.list(token);
      setItems(Array.isArray(payload.currentFocuses) ? payload.currentFocuses : []);
    } catch (requestError) {
      setError(requestError?.message || "Failed to load current focus items");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const handleChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((current) => ({ ...current, [target.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const body = { ...form, sort_order: Number(form.sort_order) };
    try {
      if (editingId) {
        await adminApi.currentFocus.update(token, editingId, body);
        setNotice("Current focus updated.");
      } else {
        await adminApi.currentFocus.create(token, body);
        setNotice("Current focus created.");
      }
      resetForm();
      await loadItems();
    } catch (requestError) {
      setError(requestError?.message || "Failed to save current focus");
    } finally {
      setSaving(false);
    }
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({
      key: item.key,
      title_en: item.title_en,
      title_id: item.title_id,
      sort_order: item.sort_order,
      is_active: Boolean(item.is_active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleItem = async (item) => {
    setError("");
    try {
      await adminApi.currentFocus.update(token, item.id, {
        key: item.key,
        title_en: item.title_en,
        title_id: item.title_id,
        sort_order: item.sort_order,
        is_active: !item.is_active,
      });
      await loadItems();
    } catch (requestError) {
      setError(requestError?.message || "Failed to change current focus visibility");
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete current focus “${item.title_en}”?`)) return;
    setError("");
    try {
      await adminApi.currentFocus.remove(token, item.id);
      if (editingId === item.id) resetForm();
      await loadItems();
    } catch (requestError) {
      setError(requestError?.message || "Failed to delete current focus");
    }
  };

  const fieldClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:focus:bg-white/10";

  return (
    <div className="space-y-6 font-body">
      <AnimatedContent>
        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:border-white/10 dark:bg-panel/80 dark:shadow-black/30 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker inline-flex items-center gap-2"><Crosshair className="h-4 w-4" /> Hero signal</p>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-cloud sm:text-4xl">Current focus</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Manage the bilingual phrases rotating inside the public hero. Active items appear in ascending order.</p>
            </div>
            <button type="button" onClick={loadItems} className="secondary-action !rounded-2xl !px-4 !py-3"><RefreshCw className="h-4 w-4" />Refresh</button>
          </div>
          {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
          {notice ? <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />{notice}</div> : null}
        </section>
      </AnimatedContent>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AnimatedContent>
          <SpotlightCard className="border border-slate-200/70 p-5 dark:border-white/10 sm:p-6" spotlightColor="rgba(139,92,246,0.10)">
            <div className="flex items-center justify-between gap-3">
              <div><p className="section-kicker">Editor</p><h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-cloud">{editingId ? "Edit phrase" : "Add phrase"}</h2></div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">{editingId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</div>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block"><span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">Key</span><input className={fieldClass} name="key" value={form.key} onChange={handleChange} placeholder="product-interfaces" /></label>
              <label className="block"><span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">English title</span><input className={fieldClass} name="title_en" value={form.title_en} onChange={handleChange} required maxLength={160} placeholder="Product interfaces" /></label>
              <label className="block"><span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">Indonesian title</span><input className={fieldClass} name="title_id" value={form.title_id} onChange={handleChange} required maxLength={160} placeholder="Antarmuka produk" /></label>
              <label className="block"><span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">Order</span><input className={fieldClass} type="number" min="0" step="1" name="sort_order" value={form.sort_order} onChange={handleChange} required /></label>
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Visible on the public site</span><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="h-4 w-4 accent-violet-600" /></label>
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={saving} className="primary-action !rounded-2xl !px-4 !py-3 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving…" : editingId ? "Save changes" : "Create focus"}</button>
                {editingId ? <button type="button" onClick={resetForm} className="secondary-action !rounded-2xl !px-4 !py-3"><X className="h-4 w-4" />Cancel</button> : null}
              </div>
            </form>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent from="right" delay={0.08}>
          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-panel/80 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="section-kicker">Rotation</p><h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-cloud">{items.length} phrases</h2></div></div>
            <div className="mt-6 space-y-3">
              {loading ? [1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />) : items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">Create the first focus phrase to replace the frontend fallback.</div> : items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-slate-400">{String(item.sort_order).padStart(2, "0")} · {item.key}</span><span className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase ${item.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>{item.is_active ? "Active" : "Hidden"}</span></div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-cloud">{item.title_en}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.title_id}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => toggleItem(item)} className="icon-action" aria-label={item.is_active ? "Hide focus" : "Show focus"}>{item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      <button onClick={() => editItem(item)} className="icon-action" aria-label="Edit focus"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => deleteItem(item)} className="icon-action hover:!border-red-400 hover:!text-red-500" aria-label="Delete focus"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
}
