import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// NOTE: This endpoint enables email existence checks (user enumeration).
// It is used only to show a better sign-in message as requested.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  if (!email || email.length > 320) {
    return NextResponse.json({ exists: false }, { status: 200 });
  }

  const admin = createAdminClient();

  // supabase-js doesn't provide getUserByEmail; we page through users.
  // This is fine for small projects; if it grows, move to a dedicated registry table.
  const perPage = 200;
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const users = data?.users ?? [];
    if (users.some((u) => (u.email ?? "").toLowerCase() === email)) {
      return NextResponse.json({ exists: true }, { status: 200 });
    }
    if (users.length < perPage) break;
  }

  return NextResponse.json({ exists: false }, { status: 200 });
}

