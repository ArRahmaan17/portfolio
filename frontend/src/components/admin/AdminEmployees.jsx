import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function AdminEmployees() {
  const token = useMemo(() => requireAdminToken(), []);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  const loadEmployees = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.employees.list(token);
      setEmployees(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRegenerate = async () => {
    if (!token) return;
    const rawCount = window.prompt("Generate how many employees?", "25");
    if (rawCount === null) return;

    const count = Number(rawCount);
    if (!Number.isFinite(count) || count <= 0) {
      setError("Count must be a positive number");
      return;
    }

    setRegenerating(true);
    setError("");
    try {
      await adminApi.employees.regenerate(token, { count: Math.floor(count) });
      await loadEmployees();
    } catch (err) {
      setError(err?.message || "Failed to regenerate employees");
    } finally {
      setRegenerating(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const haystack = `${employee.name ?? ""} ${employee.email ?? ""} ${employee.role ?? ""} ${employee.department ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Employee manager
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Employees</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Browse employee test data and regenerate it instantly for table formatter validation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadEmployees}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Sparkles className="h-4 w-4" />
              {regenerating ? "Generating..." : "Generate employees"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">All employees</p>
            <h2 className="mt-2 text-xl font-semibold">{filteredEmployees.length} rows</h2>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:dark:dark:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="mt-5 max-h-[62vh] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
          {loading && employees.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="grid min-h-48 place-items-center bg-slate-50 px-6 py-10 text-center dark:bg-slate-900/40">
              <div>
                <Users className="mx-auto h-6 w-6 text-slate-400" />
                <p className="mt-3 text-sm font-medium">No matching employees</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try another search query or generate a new employee dataset.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredEmployees.map((employee) => (
                <li
                  key={employee.id}
                  className="flex flex-col gap-4 bg-white p-4 transition hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{employee.name}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{employee.email}</div>
                        <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                          {employee.role} • {employee.department}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        employee.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200"
                          : employee.status === "probation"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Salary</div>
                      <div className="mt-1 font-semibold">{currencyFormatter.format(Number(employee.salary || 0))}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Performance</div>
                      <div className="mt-1 font-semibold">{percentFormatter.format(Number(employee.performance || 0))}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Join date</div>
                      <div className="mt-1 font-semibold">
                        {employee.join_date ? new Date(employee.join_date).toLocaleDateString("id-ID") : "-"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Remote</div>
                      <div className="mt-1 font-semibold">{employee.is_remote ? "Yes" : "No"}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">ID</div>
                      <div className="mt-1 font-semibold">#{employee.id}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
