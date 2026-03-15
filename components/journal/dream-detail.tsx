"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Loader2, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { MOODS, getMoodEmoji } from "@/lib/moods";
import type { JournalEntry } from "@/types/journal";

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DreamDetail({ entry }: { entry: JournalEntry }) {
  const t = useTranslations("Journal");
  const locale = useLocale();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [title, setTitle] = useState(entry.title ?? "");
  const [dreamText, setDreamText] = useState(entry.dreamText);
  const [mood, setMood] = useState(entry.mood ?? "");
  const [tags, setTags] = useState(entry.tags.join(", "));

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave() {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim() || null,
        dreamText,
        mood: mood || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/journal/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("detail.saveError"));
        return;
      }

      setSuccess(t("detail.saveSuccess"));
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/journal/${entry.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("detail.deleteError"));
        setConfirmDelete(false);
        return;
      }
      router.push("/journal");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  function handleCancelEdit() {
    setTitle(entry.title ?? "");
    setDreamText(entry.dreamText);
    setMood(entry.mood ?? "");
    setTags(entry.tags.join(", "));
    setEditing(false);
    setError("");
    setSuccess("");
  }

  const displayEmoji = getMoodEmoji(editing ? mood : entry.mood);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10">
      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Back */}
        <Link
          href="/journal"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("detail.back")}
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("detail.titlePlaceholder")}
                className="text-xl font-semibold bg-transparent border-b border-primary/40 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 pb-0.5"
              />
            ) : (
              <h1 className="text-xl font-semibold text-foreground">
                {entry.title ?? t("noTitle")}
              </h1>
            )}
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {formatDate(entry.createdAt, locale)}
              </p>
              {displayEmoji && (
                <span className="text-sm">{displayEmoji}</span>
              )}
            </div>
          </div>

          {!editing && !confirmDelete && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                {t("detail.edit")}
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/60 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                {t("detail.delete")}
              </button>
            </div>
          )}
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">{t("detail.deleteConfirm")}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("detail.deleteConfirmNo")}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
                {t("detail.deleteConfirmYes")}
              </button>
            </div>
          </div>
        )}

        {/* Mood selector (edit mode) */}
        {editing && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("detail.moodLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMood("")}
                className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                  mood === ""
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                —
              </button>
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                    mood === m.value
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {m.emoji} {t(`moods.${m.value}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-border" />

        {/* Dream text */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("detail.dreamLabel")}
          </label>
          {editing ? (
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
            />
          ) : (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {entry.dreamText}
            </p>
          )}
        </div>

        {/* Interpretation */}
        {entry.interpretation && (
          <>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("detail.interpretationLabel")}
              </label>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {entry.interpretation}
              </p>
            </div>
          </>
        )}

        {/* Tags */}
        {(editing || entry.tags.length > 0) && (
          <>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("detail.tagsLabel")}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder={t("detail.tagsPlaceholder")}
                  className="w-full rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Edit actions */}
        {editing && (
          <>
            {error && <p className="text-xs text-destructive">{error}</p>}
            {success && <p className="text-xs text-primary">{success}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? t("detail.saving") : t("detail.save")}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors disabled:opacity-50"
              >
                {t("detail.cancel")}
              </button>
            </div>
          </>
        )}

        {!editing && error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
