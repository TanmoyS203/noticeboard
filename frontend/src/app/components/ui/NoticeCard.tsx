import { useState } from "react";
import { X, Lock, ShieldCheck } from "lucide-react";
import { Notice, formatMeta } from "../../App";

interface NoticeCardProps {
  notice: Notice;
  isLatest: boolean;
  onDelete: (id: string, pass: string) => boolean | Promise<boolean>;
}

export function NoticeCard({ notice, isLatest, onDelete }: NoticeCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletePass, setDeletePass] = useState("");
  const [error, setError] = useState("");

  async function handleConfirmDelete() {
    if (!deletePass.trim()) {
      setError("Password required");
      return;
    }
    const success = await onDelete(notice.id, deletePass);
    if (!success) {
      setError("Invalid password");
    } else {
      setShowConfirm(false);
      setDeletePass("");
      setError("");
    }
  }

  return (
    <div
      className={`
        group relative overflow-hidden rounded-lg border bg-card
        transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30
        ${isLatest ? "border-primary/40" : "border-border"}
      `}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-[3px] transition-colors duration-200 ${
          isLatest ? "bg-primary" : "bg-border group-hover:bg-zinc-600"
        }`}
      />

      <div className="flex items-start justify-between gap-4 px-6 py-5 pl-8">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2.5">
            {isLatest && (
              <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                LATEST
              </span>
            )}
            <h3
              className="truncate text-base text-foreground"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {notice.title}
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {notice.content}
          </p>

          <p
            className="text-[11px] text-zinc-600"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formatMeta(notice.timestamp, notice.author)}
          </p>
        </div>

        {/* Delete button or Auth input */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            aria-label="Delete notice"
            className="
              mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-transparent
              text-muted-foreground transition-all duration-150
              hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive
              focus:outline-none focus:ring-1 focus:ring-destructive/50
              opacity-0 group-hover:opacity-100
            "
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        ) : (
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={deletePass}
                  onChange={(e) => {
                    setDeletePass(e.target.value);
                    setError("");
                  }}
                  placeholder="Admin Password"
                  className="w-36 rounded border border-destructive/40 bg-background py-1 pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-destructive"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
              <button
                onClick={handleConfirmDelete}
                className="rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setDeletePass("");
                  setError("");
                }}
                className="rounded border border-border px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            {error && (
              <span className="text-[10px] text-destructive" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}