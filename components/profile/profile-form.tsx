"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Loader2, Camera } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";

export function ProfileForm({
  user,
}: {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    isPremium: boolean;
    hasPassword: boolean;
  };
}) {
  const t = useTranslations("Profile");
  const router = useRouter();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const avatarChanged = avatarPreview !== user.image;
  const hasChanges =
    name !== (user.name ?? "") ||
    avatarChanged ||
    (newPassword.length > 0 && currentPassword.length > 0);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height, 256);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        setAvatarPreview(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const body: Record<string, string> = {};
    if (name !== (user.name ?? "")) body.name = name;
    if (avatarChanged) body.image = avatarPreview ?? "";
    if (newPassword && currentPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t("saveError"));
        return;
      }

      // Refresh JWT so header reflects new name/avatar immediately
      await update({
        name: body.name ?? user.name,
        picture: body.image ?? user.image,
      });

      setSuccess(t("saveSuccess"));
      setCurrentPassword("");
      setNewPassword("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const initials = (user.name ?? user.email).charAt(0).toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative shrink-0 group cursor-pointer"
        >
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt={user.name ?? user.email}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 text-primary text-xl font-semibold">
              {initials}
            </span>
          )}
          <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {user.name ?? user.email}
          </span>
          <span
            className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              user.isPremium
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {user.isPremium ? "Premium" : t("freePlan")}
          </span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t("name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="w-full rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
        />
      </div>

      {/* Email (read-only) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t("email")}
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
        />
      </div>

      {/* Password change — only for credential accounts */}
      {user.hasPassword && (
        <>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("changePassword")}
            </p>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t("currentPassword")}
              className="w-full rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("newPassword")}
              className="w-full rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>
        </>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {success && <p className="text-xs text-primary">{success}</p>}

      <div className="flex flex-col gap-3 pt-1">
        <button
          type="submit"
          disabled={loading || !hasChanges}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer disabled:cursor-default"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? t("saving") : t("save")}
        </button>

        <Link
          href="/billing"
          className="w-full text-center rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
        >
          {t("manageBilling")}
        </Link>
      </div>
    </form>
  );
}
