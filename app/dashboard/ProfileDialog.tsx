"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { X } from "lucide-react";

type Profile = {
  company_name?: string;
  phone?: string;
};

export function ProfileDialog({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial: Profile;
  onSaved: (updated?: { company_name?: string; phone?: string }) => void;
}) {
  const supabase = createBrowserClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(null);
    setPhoto(null);
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setFullName((u?.user_metadata?.full_name as string | undefined) ?? "");
      setEmail(u?.email ?? "");
      setCompanyName(initial.company_name ?? "");
      setPhone(initial.phone ?? "");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Please sign in again.");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const originalName =
        (userData.user?.user_metadata?.full_name as string | undefined) ?? "";
      const originalEmail = userData.user?.email ?? "";

      const nameChanged = fullName.trim() !== originalName.trim();
      const emailChanged = email.trim() !== originalEmail.trim();

      if (nameChanged || emailChanged) {
        const { error: updateErr } = await supabase.auth.updateUser({
          email: emailChanged ? email.trim() : undefined,
          data: nameChanged ? { full_name: fullName.trim() } : undefined,
        });
        if (updateErr) throw updateErr;
      }

      const fd = new FormData();
      if (companyName.trim()) fd.set("company_name", companyName.trim());
      if (phone.trim()) fd.set("phone", phone.trim());
      if (photo) fd.set("profile_photo", photo);

      const res = await fetch("/api/me/profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = (await res.json().catch(() => null)) as
        | { profile?: { company_name?: string; phone?: string }; error?: string }
        | null;
      if (!res.ok) {
        throw new Error(json?.error ?? "Unable to save profile");
      }

      setSuccess(
        emailChanged
          ? "Saved. If email confirmation is enabled, check your inbox to confirm the new email."
          : "Saved.",
      );
      onSaved(json?.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const field =
    "mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/25 focus:bg-white/7";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-black text-white shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-white">Profile</p>
            <p className="mt-1 text-xs text-white/70">
              Update your account and public-facing details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[75dvh] overflow-y-auto px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-white/90">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={field}
                autoComplete="name"
              />
            </label>

            <label className="text-sm">
              <span className="text-white/90">Contact email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                autoComplete="email"
                inputMode="email"
              />
            </label>

            <label className="text-sm">
              <span className="text-white/90">Company name</span>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={field}
              />
            </label>

            <label className="text-sm">
              <span className="text-white/90">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={field}
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="text-sm">
              <span className="text-white/90">Company logo / photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.item(0) ?? null)}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
              />
            </label>
            <p className="mt-2 text-xs text-white/60">
              Tip: this is used as your dashboard logo and can appear on your directory profile.
            </p>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent-gradient px-5 text-sm font-semibold text-accent-foreground shadow-accent-glow transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

