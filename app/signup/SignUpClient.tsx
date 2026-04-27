"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { authPrimaryButtonClassName } from "@/components/auth/authPrimaryButtonClassName";

const inputClassName =
  "mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-white/35 focus:ring-2 focus:ring-white/20";

const labelClassName = "text-xs font-semibold tracking-wider text-white uppercase";

export function SignUpClient() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setConfirmationSentTo(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const full_name =
      typeof fd.get("full_name") === "string" ? String(fd.get("full_name")).trim() : "";
    const email =
      typeof fd.get("email") === "string" ? String(fd.get("email")).trim() : "";
    const password =
      typeof fd.get("password") === "string" ? String(fd.get("password")) : "";
    const passwordConfirm =
      typeof fd.get("password_confirm") === "string"
        ? String(fd.get("password_confirm"))
        : "";

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      // If email confirmations are enabled, Supabase returns no session and sends a confirmation email.
      if (!data.session) {
        setConfirmationSentTo(email);
        return;
      }
      // If confirmations are disabled, we get a session immediately—continue to dashboard.
      router.push("/dashboard");
    } catch {
      setError(
        "Unable to reach the sign-up service. Please check your internet connection and Supabase settings.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/15 bg-white/8 p-8 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.75)] backdrop-blur-md sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
          <UserPlus className="h-7 w-7 text-white" strokeWidth={2} />
        </div>
        <h1 className="mt-6 text-center font-display text-3xl font-extrabold tracking-tight text-white">
          Become an Affiliate
        </h1>
        <p className="mt-2 text-center text-sm text-white">
          Create your account first. You’ll complete registration next.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}
          {confirmationSentTo ? (
            <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90">
              Confirmation email sent to{" "}
              <span className="font-semibold text-white">{confirmationSentTo}</span>. Please
              confirm your email, then sign in.
            </div>
          ) : null}

          <div>
            <label htmlFor="full_name" className={labelClassName}>
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClassName}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="password_confirm" className={labelClassName}>
              Confirm password
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              autoComplete="new-password"
              required
              className={inputClassName}
            />
          </div>

          <button type="submit" className={authPrimaryButtonClassName} disabled={pending}>
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-white">
        <p>
          Already have an account?{" "}
          <Link href="/signin" className="underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

