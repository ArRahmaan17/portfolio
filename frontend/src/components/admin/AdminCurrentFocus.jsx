import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Crosshair,
  Edit3,
  Eye,
  EyeOff,
  FolderTree,
  Layers3,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";
import AnimatedContent from "../react-bits/AnimatedContent";
import SpotlightCard from "../react-bits/SpotlightCard";

const INITIAL_CATEGORY_FORM = {
  key: "",
  title_en: "",
  title_id: "",
  sort_order: 0,
  is_active: true,
};

const INITIAL_ITEM_FORM = {
  category_id: "",
  key: "",
  title_en: "",
  title_id: "",
  sort_order: 0,
  is_active: true,
};

const fieldClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-cloud dark:focus:bg-white/10";
const labelClass = "mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500";

function VisibilityToggle({ checked, name, onChange, label = "Visible on the public site" }) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-violet-600" />
    </label>
  );
}

function StatusPill({ active }) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase ${active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
      {active ? "Active" : "Hidden"}
    </span>
  );
}

export default function AdminCurrentFocus() {
  const token = useMemo(() => requireAdminToken(), []);
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);
  const [itemForm, setItemForm] = useState(INITIAL_ITEM_FORM);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const itemCount = useMemo(
    () => categories.reduce((total, category) => total + (category.currentFocuses?.length || 0), 0),
    [categories],
  );

  const loadCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.currentFocus.list(token);
      const nextCategories = Array.isArray(payload.currentFocusCategories) ? payload.currentFocusCategories : [];
      setCategories(nextCategories);
      setItemForm((current) => {
        const selectedStillExists = nextCategories.some((category) => Number(category.id) === Number(current.category_id));
        return selectedStillExists ? current : { ...current, category_id: nextCategories[0]?.id || "" };
      });
    } catch (requestError) {
      setError(requestError?.message || "Failed to load current focus categories");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const resetCategoryForm = () => {
    setCategoryForm(INITIAL_CATEGORY_FORM);
    setEditingCategoryId(null);
  };

  const resetItemForm = (preferredCategoryId = "") => {
    setItemForm({
      ...INITIAL_ITEM_FORM,
      category_id: preferredCategoryId || categories[0]?.id || "",
    });
    setEditingItemId(null);
  };

  const handleCategoryChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    setCategoryForm((current) => ({ ...current, [target.name]: value }));
  };

  const handleItemChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    setItemForm((current) => ({ ...current, [target.name]: value }));
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    setSavingCategory(true);
    setError("");
    setNotice("");
    const body = { ...categoryForm, sort_order: Number(categoryForm.sort_order) };
    try {
      if (editingCategoryId) {
        await adminApi.currentFocus.updateCategory(token, editingCategoryId, body);
        setNotice("Focus category updated.");
      } else {
        await adminApi.currentFocus.createCategory(token, body);
        setNotice("Focus category created.");
      }
      resetCategoryForm();
      await loadCategories();
    } catch (requestError) {
      setError(requestError?.message || "Failed to save focus category");
    } finally {
      setSavingCategory(false);
    }
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setSavingItem(true);
    setError("");
    setNotice("");
    const body = {
      ...itemForm,
      category_id: Number(itemForm.category_id),
      sort_order: Number(itemForm.sort_order),
    };
    try {
      if (editingItemId) {
        await adminApi.currentFocus.update(token, editingItemId, body);
        setNotice("Current focus updated.");
      } else {
        await adminApi.currentFocus.create(token, body);
        setNotice("Current focus created.");
      }
      resetItemForm(itemForm.category_id);
      await loadCategories();
    } catch (requestError) {
      setError(requestError?.message || "Failed to save current focus");
    } finally {
      setSavingItem(false);
    }
  };

  const editCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      key: category.key,
      title_en: category.title_en,
      title_id: category.title_id,
      sort_order: category.sort_order,
      is_active: Boolean(category.is_active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editItem = (item) => {
    setEditingItemId(item.id);
    setItemForm({
      category_id: item.category_id,
      key: item.key,
      title_en: item.title_en,
      title_id: item.title_id,
      sort_order: item.sort_order,
      is_active: Boolean(item.is_active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = async (category) => {
    setError("");
    try {
      await adminApi.currentFocus.patchCategory(token, category.id, { is_active: !category.is_active });
      await loadCategories();
    } catch (requestError) {
      setError(requestError?.message || "Failed to change category visibility");
    }
  };

  const toggleItem = async (item) => {
    setError("");
    try {
      await adminApi.currentFocus.update(token, item.id, {
        category_id: item.category_id,
        key: item.key,
        title_en: item.title_en,
        title_id: item.title_id,
        sort_order: item.sort_order,
        is_active: !item.is_active,
      });
      await loadCategories();
    } catch (requestError) {
      setError(requestError?.message || "Failed to change current focus visibility");
    }
  };

  const deleteCategory = async (category) => {
    const count = category.currentFocuses?.length || 0;
    if (!window.confirm(`Delete category “${category.title_en}”?${count ? ` It still contains ${count} focus item${count === 1 ? "" : "s"}.` : ""}`)) return;
    setError("");
    try {
      await adminApi.currentFocus.removeCategory(token, category.id);
      if (editingCategoryId === category.id) resetCategoryForm();
      await loadCategories();
    } catch (requestError) {
      setError(requestError?.message || "Failed to delete focus category");
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete current focus “${item.title_en}”?`)) return;
    setError("");
    try {
      await adminApi.currentFocus.remove(token, item.id);
      if (editingItemId === item.id) resetItemForm(item.category_id);
      await loadCategories();
    } catch (requestError) {
      setError(requestError?.message || "Failed to delete current focus");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <AnimatedContent>
        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:border-white/10 dark:bg-panel/80 dark:shadow-black/30 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker inline-flex items-center gap-2"><Crosshair className="h-4 w-4" /> Hero activity board</p>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-cloud sm:text-4xl">Current focus</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Group bilingual focus items into visible categories. Each public category runs its own phrase rotation.</p>
            </div>
            <button type="button" onClick={loadCategories} className="secondary-action !rounded-2xl !px-4 !py-3"><RefreshCw className="h-4 w-4" />Refresh</button>
          </div>
          {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
          {notice ? <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />{notice}</div> : null}
        </section>
      </AnimatedContent>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnimatedContent>
          <SpotlightCard className="h-full border border-slate-200/70 p-5 dark:border-white/10 sm:p-6" spotlightColor="rgba(14,165,233,0.10)">
            <div className="flex items-center justify-between gap-3">
              <div><p className="section-kicker">Categories</p><h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-cloud">{editingCategoryId ? "Edit category" : "Add category"}</h2></div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300"><FolderTree className="h-5 w-5" /></div>
            </div>
            <form onSubmit={saveCategory} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2"><span className={labelClass}>Key</span><input className={fieldClass} name="key" value={categoryForm.key} onChange={handleCategoryChange} placeholder="photography" /></label>
              <label className="block"><span className={labelClass}>English title</span><input className={fieldClass} name="title_en" value={categoryForm.title_en} onChange={handleCategoryChange} required maxLength={160} placeholder="Photography" /></label>
              <label className="block"><span className={labelClass}>Indonesian title</span><input className={fieldClass} name="title_id" value={categoryForm.title_id} onChange={handleCategoryChange} required maxLength={160} placeholder="Fotografi" /></label>
              <label className="block"><span className={labelClass}>Order</span><input className={fieldClass} type="number" min="0" step="1" name="sort_order" value={categoryForm.sort_order} onChange={handleCategoryChange} required /></label>
              <VisibilityToggle name="is_active" checked={categoryForm.is_active} onChange={handleCategoryChange} />
              <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
                <button type="submit" disabled={savingCategory} className="primary-action !rounded-2xl !px-4 !py-3 disabled:opacity-60"><Save className="h-4 w-4" />{savingCategory ? "Saving…" : editingCategoryId ? "Save category" : "Create category"}</button>
                {editingCategoryId ? <button type="button" onClick={resetCategoryForm} className="secondary-action !rounded-2xl !px-4 !py-3"><X className="h-4 w-4" />Cancel</button> : null}
              </div>
            </form>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent from="right" delay={0.08}>
          <SpotlightCard className="h-full border border-slate-200/70 p-5 dark:border-white/10 sm:p-6" spotlightColor="rgba(139,92,246,0.10)">
            <div className="flex items-center justify-between gap-3">
              <div><p className="section-kicker">Focus items</p><h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-cloud">{editingItemId ? "Edit focus" : "Add focus"}</h2></div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">{editingItemId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</div>
            </div>
            {categories.length === 0 && !loading ? <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">Create a category before adding focus items.</div> : (
              <form onSubmit={saveItem} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2"><span className={labelClass}>Category</span><select className={fieldClass} name="category_id" value={itemForm.category_id} onChange={handleItemChange} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.title_en} / {category.title_id}</option>)}</select></label>
                <label className="block sm:col-span-2"><span className={labelClass}>Key</span><input className={fieldClass} name="key" value={itemForm.key} onChange={handleItemChange} placeholder="camera-studies" /></label>
                <label className="block"><span className={labelClass}>English title</span><input className={fieldClass} name="title_en" value={itemForm.title_en} onChange={handleItemChange} required maxLength={160} placeholder="Street photography" /></label>
                <label className="block"><span className={labelClass}>Indonesian title</span><input className={fieldClass} name="title_id" value={itemForm.title_id} onChange={handleItemChange} required maxLength={160} placeholder="Fotografi jalanan" /></label>
                <label className="block"><span className={labelClass}>Order</span><input className={fieldClass} type="number" min="0" step="1" name="sort_order" value={itemForm.sort_order} onChange={handleItemChange} required /></label>
                <VisibilityToggle name="is_active" checked={itemForm.is_active} onChange={handleItemChange} />
                <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
                  <button type="submit" disabled={savingItem} className="primary-action !rounded-2xl !px-4 !py-3 disabled:opacity-60"><Save className="h-4 w-4" />{savingItem ? "Saving…" : editingItemId ? "Save focus" : "Create focus"}</button>
                  {editingItemId ? <button type="button" onClick={() => resetItemForm()} className="secondary-action !rounded-2xl !px-4 !py-3"><X className="h-4 w-4" />Cancel</button> : null}
                </div>
              </form>
            )}
          </SpotlightCard>
        </AnimatedContent>
      </div>

      <AnimatedContent delay={0.1}>
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-panel/80 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="section-kicker inline-flex items-center gap-2"><Layers3 className="h-4 w-4" /> Activity board</p><h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-cloud">{categories.length} categories · {itemCount} focus items</h2></div>
            <p className="max-w-md text-right text-xs leading-5 text-slate-500 dark:text-slate-400">Category order controls the public rows. Item order controls each row’s rotation.</p>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? [1, 2].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />) : categories.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">Create the first category to start the public activity board.</div> : categories.map((category) => (
              <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.035]">
                <header className="flex flex-col gap-4 border-b border-slate-200/80 px-4 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-slate-400">{String(category.sort_order).padStart(2, "0")} · {category.key}</span><StatusPill active={category.is_active} /></div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-cloud">{category.title_en} <span className="font-body text-sm font-normal text-slate-400">/ {category.title_id}</span></h3>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => toggleCategory(category)} className="icon-action" aria-label={category.is_active ? `Hide ${category.title_en} category` : `Show ${category.title_en} category`}>{category.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    <button type="button" onClick={() => editCategory(category)} className="icon-action" aria-label={`Edit ${category.title_en} category`}><Edit3 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => deleteCategory(category)} className="icon-action hover:!border-red-400 hover:!text-red-500" aria-label={`Delete ${category.title_en} category`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </header>
                <div className="grid gap-3 p-4 lg:grid-cols-2">
                  {(category.currentFocuses || []).length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 lg:col-span-2">No focus items yet. This public row will show the localized empty state.</div> : category.currentFocuses.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-void/35">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-slate-400">{String(item.sort_order).padStart(2, "0")} · {item.key}</span><StatusPill active={item.is_active} /></div>
                          <h4 className="mt-2 font-display text-base font-semibold text-slate-900 dark:text-cloud">{item.title_en}</h4>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.title_id}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button type="button" onClick={() => toggleItem(item)} className="icon-action" aria-label={item.is_active ? `Hide ${item.title_en}` : `Show ${item.title_en}`}>{item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                          <button type="button" onClick={() => editItem(item)} className="icon-action" aria-label={`Edit ${item.title_en}`}><Edit3 className="h-4 w-4" /></button>
                          <button type="button" onClick={() => deleteItem(item)} className="icon-action hover:!border-red-400 hover:!text-red-500" aria-label={`Delete ${item.title_en}`}><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </AnimatedContent>
    </div>
  );
}
