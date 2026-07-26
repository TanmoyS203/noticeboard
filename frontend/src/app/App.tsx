import { useState, useEffect } from "react";
import { Radio, ShieldCheck, Send, Rss, AlertCircle, Lock, Eye, EyeOff, Plus, ChevronUp } from "lucide-react";
import { NoticeCard } from "./components/ui/NoticeCard";

export interface Notice {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL;

export function formatMeta(date: Date, author: string): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${d} ${h}:${mi} UTC · @${author}`;
}

export default function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);

  // Compose form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [published, setPublished] = useState(false);

  // 1. Fetch notices from SQL Database on component mount
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setNotices(formatted);
      })
      .catch((err) => console.error("Error connecting to backend:", err));
  }, []);

  // 2. Publish new notice via backend API
  async function handlePublish() {
    if (!adminPass.trim()) {
      setPublishError("Admin credentials are required to publish a notice.");
      return;
    }
    if (!title.trim() || !author.trim() || !content.trim()) {
      setPublishError("All notice fields must be filled before publishing.");
      return;
    }
    setPublishError("");

    const newNotice = {
      id: `n${Date.now()}`,
      title: title.trim(),
      author: author.trim().toLowerCase().replace(/\s+/g, "-"),
      content: content.trim(),
      adminPass: adminPass.trim(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      });

      if (!res.ok) {
        const errData = await res.json();
        setPublishError(errData.error || "Failed to publish notice.");
        return;
      }

      const savedNotice = await res.json();
      setNotices([
        { ...savedNotice, timestamp: new Date(savedNotice.timestamp) },
        ...notices,
      ]);

      setTitle("");
      setAuthor("");
      setContent("");
      setAdminPass("");
      setPublished(true);
      setTimeout(() => {
        setPublished(false);
        setComposeOpen(false);
      }, 1800);
    } catch (err) {
      setPublishError("Network error: Could not reach backend server.");
    }
  }

  // 3. Delete notice via backend API
  async function handleDelete(id: string, pass: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": pass,
        },
      });

      if (!res.ok) {
        return false; // Wrong password or server error
      }

      setNotices((prev) => prev.filter((n) => n.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete notice", err);
      return false;
    }
  }

  function handleToggleCompose() {
    setComposeOpen((v) => !v);
    setPublishError("");
    setPublished(false);
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-primary/40 bg-primary/10">
              <Radio className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1
                className="text-lg leading-none tracking-tight text-foreground"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                NOTICEBOARD
              </h1>
              <p
                className="text-[10px] tracking-widest text-muted-foreground"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                BROADCAST · INTERNAL
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleCompose}
            className={`
              group flex items-center gap-2 rounded border px-4 py-2 text-sm font-semibold
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/40
              ${composeOpen
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
              }
            `}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            {composeOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
            )}
            {composeOpen ? "Close" : "New Notice"}
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">

        {/* ── COMPOSE PANEL ── */}
        {composeOpen && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <span
                className="text-xs tracking-widest text-primary uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                // NEW NOTICE
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="overflow-hidden rounded-lg border border-primary/30 bg-card shadow-xl shadow-black/50">
              <div className="flex items-start justify-between border-b border-border px-6 py-5">
                <div>
                  <h2
                    className="text-2xl text-foreground"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Compose &amp; Publish
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Broadcast a new notice to all board subscribers.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="rounded-md border border-border bg-background/60 px-4 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    <span
                      className="text-xs font-semibold uppercase tracking-widest text-primary"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Admin Credentials
                    </span>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Enter admin password to authorize"
                      className="
                        w-full rounded border border-border bg-background py-2.5 pl-10 pr-10
                        text-sm text-foreground placeholder:text-muted-foreground
                        transition-all duration-150
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40
                      "
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span
                    className="text-[10px] tracking-widest text-muted-foreground uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Notice Details
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Notice Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Scheduled downtime Friday 03:00 UTC"
                      className="
                        w-full rounded border border-border bg-background px-3.5 py-2.5
                        text-sm text-foreground placeholder:text-muted-foreground
                        transition-all duration-150
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                      "
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. ops-core or Jane Doe"
                      className="
                        w-full rounded border border-border bg-background px-3.5 py-2.5
                        text-sm text-foreground placeholder:text-muted-foreground
                        transition-all duration-150
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                      "
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Notice Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    placeholder="Write your full notice body here. Be concise and direct."
                    className="
                      w-full resize-none rounded border border-border bg-background px-3.5 py-2.5
                      text-sm leading-relaxed text-foreground placeholder:text-muted-foreground
                      transition-all duration-150
                      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                    "
                  />
                </div>

                {publishError && (
                  <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 px-3.5 py-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-xs text-destructive">{publishError}</p>
                  </div>
                )}

                {published && (
                  <div className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs text-primary" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      NOTICE PUBLISHED — BROADCASTING NOW
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <button
                    onClick={handleToggleCompose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={published}
                    className="
                      group flex items-center gap-2 rounded bg-primary px-5 py-2.5
                      text-sm font-semibold text-primary-foreground
                      transition-all duration-150
                      hover:bg-primary/85 hover:shadow-lg hover:shadow-primary/20
                      active:scale-[0.98]
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                      disabled:opacity-60 disabled:pointer-events-none
                    "
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                  >
                    <Send className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    Publish Notice
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FEED ── */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span
              className="text-xs tracking-widest text-accent uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // ACTIVE ANNOUNCEMENTS
            </span>
            <div className="h-px flex-1 bg-border" />
            <span
              className="text-xs text-muted-foreground tabular-nums"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {notices.length} LIVE
            </span>
          </div>

          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16 text-center">
              <Rss className="mb-3 h-8 w-8 text-muted-foreground/40" strokeWidth={1} />
              <p className="text-sm text-muted-foreground">No active notices. Publish one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice, idx) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  isLatest={idx === 0}
                  onDelete={(id, pass) => handleDelete(id, pass)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-border px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span
            className="text-[11px] text-muted-foreground"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            NOTICEBOARD v2.4.1 · INTERNAL SYSTEM
          </span>
          <span
            className="text-[11px] text-muted-foreground"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {new Date().toISOString().split("T")[0]} UTC
          </span>
        </div>
      </footer>
    </div>
  );
}