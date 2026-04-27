import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET, assertFileOk, sanitizeFilename } from "@/lib/affiliate-application";

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

  const publicClient = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userErr } = await publicClient.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: existing, error: fetchErr } = await admin
    .from("affiliate_applications")
    .select("id,profile_photo_path")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!existing?.id) {
    return NextResponse.json({ error: "No application found" }, { status: 404 });
  }

  const uploadedPaths: string[] = [];
  try {
    const formData = await request.formData();

    const company_name =
      typeof formData.get("company_name") === "string"
        ? String(formData.get("company_name")).trim()
        : "";
    const phone =
      typeof formData.get("phone") === "string" ? String(formData.get("phone")).trim() : "";

    const photoEntry = formData.get("profile_photo");
    let profilePhotoPath: string | null = existing.profile_photo_path ?? null;

    if (photoEntry instanceof File && photoEntry.size > 0) {
      const check = assertFileOk(photoEntry, "Photo / logo");
      if (!check.ok) {
        return NextResponse.json({ error: check.message }, { status: 400 });
      }
      const name = sanitizeFilename(photoEntry.name || "photo.webp");
      profilePhotoPath = `${existing.id}/profile_${name}`;
      const buf = Buffer.from(await photoEntry.arrayBuffer());
      const { error } = await admin.storage.from(BUCKET).upload(profilePhotoPath, buf, {
        contentType: photoEntry.type || "application/octet-stream",
        upsert: true,
      });
      if (error) {
        throw new Error(error.message);
      }
      uploadedPaths.push(profilePhotoPath);
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (company_name) patch.company_name = company_name;
    if (phone) patch.phone = phone;
    patch.profile_photo_path = profilePhotoPath;
    patch.email = userData.user.email ?? "";

    const { data: updated, error: updateErr } = await admin
      .from("affiliate_applications")
      .update(patch)
      .eq("id", existing.id)
      .select("id,company_name,phone,profile_photo_path,email")
      .single();

    if (updateErr) {
      throw new Error(updateErr.message);
    }

    return NextResponse.json({ profile: updated }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

