# FireDoor Network

**A network that leads to work.**

We are **not** building another blanket trade association. We are building a UK network where verified fire door surveyors and inspectors **actually get work**: searchable directory, verified credentials, and a signup pipeline that becomes our core asset (the applicant database).

**Positioning:** replace weak “association homepages” with a **sales-led landing**, a **real application flow**, and (next) **admin review** plus a **public directory** so the value is visible on day one.

## MVP scope (realistic timeline)

| Phase | Focus |
|--------|--------|
| Week 1–2 | Design + wireframes |
| Week 3–5 | Development |
| Week 6 | Testing + launch |

Target: **live in roughly 4–6 weeks** for a credible MVP.

### Core (must-have)

1. **Landing** — Hero, How it works, Why join, Trust/compliance, CTA → Become an Affiliate ([live reference tone](https://fire-door-connect.lovable.app/)).
2. **Affiliate signup** — Form + document uploads + Supabase (this repo: **implemented**).
3. **Admin dashboard** — View / approve / reject / download / verified + notes (**next**).
4. **Public directory** — Search + filters + profile cards + contact (**after admin**).
5. **Affiliate profile page** — Public URL per approved affiliate (**with directory**).

### Phase 2 (nice-to-have)

Job dispatch, messaging, subscriptions, ratings/reviews, training portal — **explicitly out of MVP**.

## What is implemented now

- **Marketing site** at `/` — same narrative as the reference: work-first, not “another NAFDI”.
- **Affiliate application** at `/apply` — collects name, company, email, phone, postcode, years of experience, areas covered, certifications (multi-file), insurance, optional DBS; submits to **POST `/api/affiliate-applications`**.
- **Supabase** — Table `affiliate_applications` + private bucket `application-documents`; server uses **service role** only (no public DB access).

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com/).
2. **SQL**: run `supabase/migrations/001_affiliate_applications.sql` in **SQL Editor** (creates table + storage bucket).
3. **Env**: copy `.env.example` → `.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (reserved for upcoming admin/auth client)
   - `SUPABASE_SERVICE_ROLE_KEY` (**server only** — never commit)

4. Restart `npm run dev` and submit a test application at `/apply`.

Documents are stored under `{application_id}/…` in the private bucket; rows are inserted after uploads succeed (failed DB insert triggers best-effort file cleanup).

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/) (`@supabase/supabase-js`) — database + storage
- [Zod](https://zod.dev/) — server-side validation
- [lucide-react](https://lucide.dev/) — icons
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) + [Inter](https://fonts.google.com/specimen/Inter) via `next/font`

## Local development

```bash
npm install
npm run dev
```

- [http://localhost:3000](http://localhost:3000) — landing  
- [http://localhost:3000/apply](http://localhost:3000/apply) — affiliate signup  

```bash
npm run build
npm run start
npm run lint
```

## Project layout

| Path | Role |
|------|------|
| `app/page.tsx` | Landing |
| `app/apply/` | Application form + thanks page |
| `app/api/affiliate-applications/route.ts` | Secure create + uploads |
| `components/landing/` | Marketing UI |
| `components/apply/` | Application form |
| `lib/supabase/admin.ts` | Service-role client (server only) |
| `lib/affiliate-application.ts` | Validation helpers |
| `supabase/migrations/` | SQL to run in Supabase |

## Next up (suggested)

**Admin dashboard** (early): Supabase Auth for staff, RLS policies for `affiliate_applications` + signed URLs for downloads, approve/reject/verified + `internal_notes`.

Then **public directory** + **affiliate profile** routes backed by approved rows.
