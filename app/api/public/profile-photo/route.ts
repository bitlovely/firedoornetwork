import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET } from "@/lib/affiliate-application";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = (searchParams.get("id") ?? "").trim();
  if (!id) return new NextResponse(null, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("affiliate_applications")
    .select("id,status,profile_photo_path")
    .eq("id", id)
    .in("status", ["approved", "verified"])
    .maybeSingle();
  if (error || !data?.profile_photo_path) return new NextResponse(null, { status: 404 });

  const { data: signed, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(data.profile_photo_path, 60);
  if (signErr) return new NextResponse(null, { status: 500 });

  return NextResponse.redirect(signed.signedUrl);
}

