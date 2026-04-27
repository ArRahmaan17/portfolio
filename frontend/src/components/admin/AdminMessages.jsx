import { useEffect, useMemo, useState } from "react";
import {
  MailOpen,
  MessageSquare,
  PencilLine,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { adminApi, requireAdminToken } from "../../utils/adminApi";

export default function AdminMessages() {
  const token = useMemo(() => requireAdminToken(), []);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const loadMessages = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.messages.list(token);
      setMessages(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (msg) => {
    if (!token) return;
    const ok = window.confirm(`Delete message from "${msg.fullName}"?`);
    if (!ok) return;

    setLoading(true);
    setError("");
    try {
      await adminApi.messages.remove(token, msg.id);
      await loadMessages();
    } catch (err) {
      setError(err?.message || "Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const haystack = `${msg.fullName ?? ""} ${msg.email ?? ""} ${msg.message ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const selectedMessage =
    filteredMessages.find((msg) => msg.id === selectedMessageId) ?? filteredMessages[0] ?? null;

  return (
    <div className="space-y-6 text-black dark:text-white">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_30%)] p-6 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Inbox
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Messages</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Review contact submissions, open a message to read it in detail, and clear it once it is handled.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
           className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:hover:bg-slate-950 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh inbox
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">All messages</p>
              <h2 className="mt-2 text-xl font-semibold">{filteredMessages.length} in inbox</h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedMessageId(null);
                }}
                placeholder="Search messages"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:dark:dark:bg-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-5 max-h-[55vh] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            {loading && messages.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="grid min-h-48 place-items-center bg-slate-50 px-6 py-10 text-center dark:bg-slate-900/40">
                <div>
                  <MessageSquare className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">No matching messages</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Adjust the search or wait for new contact submissions.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredMessages.map((msg) => {
                  const active = selectedMessage?.id === msg.id;
                  return (
                    <li
                      key={msg.id}
                      className={`cursor-pointer bg-white p-4 transition dark:bg-slate-950 ${
                        active ? "bg-slate-50 dark:bg-slate-900/60" : "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      }`}
                      onClick={() => setSelectedMessageId(msg.id)}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                            <MailOpen className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{msg.fullName}</div>
                            <div className="mt-1 truncate text-xs text-slate-500">{msg.email}</div>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                              {msg.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessageId(msg.id);
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          >
                            <PencilLine className="h-3.5 w-3.5" />
                            Read
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(msg);
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                          <time className="w-full text-right text-xs text-slate-500 sm:w-auto">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                          </time>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Reading pane</p>
              <h2 className="mt-2 text-xl font-semibold">Selected message</h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <MailOpen className="h-5 w-5" />
            </div>
          </div>

          {selectedMessage ? (
            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold">{selectedMessage.fullName}</div>
                  <div className="mt-1 truncate text-sm text-slate-500">{selectedMessage.email}</div>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-400">
                  {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString() : ""}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                {selectedMessage.message}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <PencilLine className="h-4 w-4" />
                  Reply by email
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete message
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid min-h-72 place-items-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <div>
                <MailOpen className="mx-auto h-7 w-7 text-slate-400" />
                <p className="mt-3 text-sm font-medium">Select a message</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Open any inbox item to read the full submission here.
                </p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
