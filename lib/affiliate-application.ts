import { z } from "zod";

const MAX_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const affiliateApplicationFieldSchema = z.object({
  full_name: z.string().trim().min(2).max(200),
  company_name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(8).max(40),
  postcode: z.string().trim().min(3).max(16),
  years_experience: z.coerce.number().int().min(0).max(80),
  areas_covered: z.string().trim().min(3).max(4000),
});

export type AffiliateApplicationFields = z.infer<
  typeof affiliateApplicationFieldSchema
>;

export function assertFileOk(
  file: File,
  label: string,
): { ok: true } | { ok: false; message: string } {
  if (file.size === 0) {
    return { ok: false, message: `${label}: file is empty` };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: `${label}: file must be at most 5MB` };
  }
  if (!allowedTypes.has(file.type)) {
    return {
      ok: false,
      message: `${label}: only PDF, JPEG, PNG, or WebP allowed`,
    };
  }
  return { ok: true };
}

export const BUCKET = "application-documents" as const;

export function sanitizeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.length > 0 ? base.slice(0, 180) : "upload";
}
