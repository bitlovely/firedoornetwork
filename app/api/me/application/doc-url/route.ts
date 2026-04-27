import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET } from "@/lib/affiliate-application";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { error: "Missing Supabase public env vars" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const path = body?.path;
  if (typeof path !== "string" || path.length === 0) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const publicClient = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await publicClient.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure the requested storage path belongs to the signed-in user’s application.
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("affiliate_applications")
    .select("id,certification_paths,insurance_path,dbs_path,profile_photo_path,sample_report_paths")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "No application found" }, { status: 404 });
  }

  const certs = Array.isArray(data.certification_paths)
    ? (data.certification_paths.filter((v): v is string => typeof v === "string") as string[])
    : [];
  const samples = Array.isArray(data.sample_report_paths)
    ? (data.sample_report_paths.filter((v): v is string => typeof v === "string") as string[])
    : [];
  const allowed = new Set<string>([
    ...certs,
    ...samples,
    ...(typeof data.insurance_path === "string" ? [data.insurance_path] : []),
    ...(typeof data.dbs_path === "string" ? [data.dbs_path] : []),
    ...(typeof data.profile_photo_path === "string" ? [data.profile_photo_path] : []),
  ]);

  if (!allowed.has(path)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: signed, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, 60);

  if (signErr) {
    return NextResponse.json({ error: signErr.message }, { status: 500 });
  }
  return NextResponse.json({ url: signed.signedUrl }, { status: 200 });
}

