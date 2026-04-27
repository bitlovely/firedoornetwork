"use client";

import { useEffect } from "react";

/**
 * Some Supabase recovery links end up on the site root (/) with tokens in the URL hash.
 * This component detects those and forwards the user to /reset-password, preserving the hash.
 */
export function RecoveryHashRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash || "";
    if (!hash) return;
    // Supabase appends `type=recovery` in the hash for password reset flows.
    if (!hash.includes("type=recovery")) return;

    // Avoid loops if already on /reset-password.
    if (window.location.pathname.startsWith("/reset-password")) return;

    window.location.replace(`/reset-password${hash}`);
  }, []);

  return null;
}

