"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Loader2, UploadCloud } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Props = {
  open: boolean;
  onClose: () => void;
  onCompleted: () => void;
};

export function CompleteRegistrationDialog({ open, onClose, onCompleted }: Props) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError("Please sign in again.");
        return;
      }

      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/me/register-affiliate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Submission failed");
        return;
      }
      onCompleted();
      onClose();
    } catch {
      setError("Network error — please try again");
    } finally {
      setPending(false);
    }
  }

  const field =
    "mt-1.5 min-h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/60 outline-none transition-colors focus:border-white/35 focus:ring-2 focus:ring-white/20 sm:px-4";

  const selectField =
    "mt-1.5 min-h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/35 focus:ring-2 focus:ring-white/20 sm:px-4 [color-scheme:dark] [&>option]:bg-black [&>option]:text-white";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative mx-auto flex min-h-dvh max-w-3xl items-start px-4 py-6 sm:py-10">
        <div className="w-full overflow-hidden rounded-3xl border border-white/15 bg-black text-white shadow-[0_30px_90px_-60px_rgba(0,0,0,0.75)]">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6 sm:p-7">
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight">
                Complete registration
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Add your company details and upload your documents to be verified.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className="max-h-[calc(100dvh-9rem)] space-y-6 overflow-y-auto p-6 sm:max-h-[calc(100dvh-10.5rem)] sm:p-7"
          >
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="company_name" className="text-sm font-medium text-white">
                  Company name <span className="text-accent">*</span>
                </label>
                <input id="company_name" name="company_name" required className={field} />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-white">
                  Phone <span className="text-accent">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className={field}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="postcode" className="text-sm font-medium text-white">
                  Location (postcode) <span className="text-accent">*</span>
                </label>
                <input
                  id="postcode"
                  name="postcode"
                  required
                  autoComplete="postal-code"
                  placeholder="e.g. SW1A 1AA"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="years_experience" className="text-sm font-medium text-white">
                  Years of experience <span className="text-accent">*</span>
                </label>
                <select
                  id="years_experience"
                  name="years_experience"
                  required
                  defaultValue=""
                  className={selectField}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {Array.from({ length: 51 }, (_, i) => (
                    <option key={i} value={i}>
                      {i} {i === 1 ? "year" : "years"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="areas_covered" className="text-sm font-medium text-white">
                Areas you cover <span className="text-accent">*</span>
              </label>
              <textarea
                id="areas_covered"
                name="areas_covered"
                required
                rows={4}
                className={field}
                placeholder="Postcodes, counties, or radius you work…"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Documents</p>
              <p className="mt-1 text-xs text-white/70">
                PDF, JPEG, PNG, or WebP. Max 5MB per file.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="certifications" className="text-sm font-medium text-white">
                    Certifications <span className="text-accent">*</span>
                  </label>
                  <input
                    id="certifications"
                    name="certifications"
                    type="file"
                    required
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                    className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white`}
                  />
                </div>
                <div>
                  <label htmlFor="insurance" className="text-sm font-medium text-white">
                    Insurance proof <span className="text-accent">*</span>
                  </label>
                  <input
                    id="insurance"
                    name="insurance"
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                    className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white`}
                  />
                </div>
                <div>
                  <label htmlFor="dbs" className="text-sm font-medium text-white">
                    DBS check (optional)
                  </label>
                  <input
                    id="dbs"
                    name="dbs"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                    className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white`}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-gradient px-8 text-sm font-semibold text-accent-foreground shadow-accent-glow transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    Submit registration
                  </>
                )}
              </button>
              <p className="text-xs text-white/60">
                We’ll review your documents before listing you.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

