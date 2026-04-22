"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function AffiliateApplicationForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/affiliate-applications", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Submission failed");
        return;
      }
      if (data.id) {
        router.push(`/apply/thanks?id=${encodeURIComponent(data.id)}`);
        return;
      }
      setError("Unexpected response");
    } catch {
      setError("Network error — please try again");
    } finally {
      setPending(false);
    }
  }

  const field =
    "mt-1.5 w-full rounded-xl bg-neu px-3 py-2 text-foreground shadow-[inset_8px_8px_18px_hsl(var(--neu-shadow-dark)),_inset_-8px_-8px_18px_hsl(var(--neu-shadow-light))] outline-none transition-[box-shadow] focus-visible:neu-ring";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-primary">About you</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="text-sm font-medium text-foreground">
              Full name <span className="text-accent">*</span>
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              autoComplete="name"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="company_name" className="text-sm font-medium text-foreground">
              Company name <span className="text-accent">*</span>
            </label>
            <input
              id="company_name"
              name="company_name"
              required
              autoComplete="organization"
              className={field}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
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
        <div>
          <label htmlFor="postcode" className="text-sm font-medium text-foreground">
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
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-primary">Experience & coverage</h2>
        <div>
          <label htmlFor="years_experience" className="text-sm font-medium text-foreground">
            Years of experience <span className="text-accent">*</span>
          </label>
          <select
            id="years_experience"
            name="years_experience"
            required
            defaultValue=""
            className={field}
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
        <div>
          <label htmlFor="areas_covered" className="text-sm font-medium text-foreground">
            Areas you cover <span className="text-accent">*</span>
          </label>
          <textarea
            id="areas_covered"
            name="areas_covered"
            required
            rows={4}
            placeholder="Postcodes, counties, or radius you work (e.g. M25, West Midlands within 40 miles…)"
            className={field}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-primary">Documents</h2>
        <p className="text-sm text-muted-foreground">
          PDF, JPEG, PNG, or WebP. Max 5MB per file. Certifications: upload one or more files.
        </p>
        <div>
          <label htmlFor="certifications" className="text-sm font-medium text-foreground">
            Certifications <span className="text-accent">*</span>
          </label>
          <input
            id="certifications"
            name="certifications"
            type="file"
            required
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium`}
          />
        </div>
        <div>
          <label htmlFor="insurance" className="text-sm font-medium text-foreground">
            Insurance proof <span className="text-accent">*</span>
          </label>
          <input
            id="insurance"
            name="insurance"
            type="file"
            required
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium`}
          />
        </div>
        <div>
          <label htmlFor="dbs" className="text-sm font-medium text-foreground">
            DBS check (optional)
          </label>
          <input
            id="dbs"
            name="dbs"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium`}
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent-gradient px-8 font-semibold text-accent-foreground shadow-accent-glow transition-opacity disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </button>
        <p className="text-xs text-muted-foreground">
          By submitting you confirm the information is accurate. Our team will review your
          documents before approval.
        </p>
      </div>
    </form>
  );
}
