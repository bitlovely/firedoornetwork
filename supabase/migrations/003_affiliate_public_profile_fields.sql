-- Public profile fields & verification flags for directory profiles.

alter table public.affiliate_applications
  add column if not exists profile_photo_path text,
  add column if not exists bio text,
  add column if not exists services text,
  add column if not exists sample_report_paths jsonb not null default '[]'::jsonb,
  add column if not exists verified_insurance boolean not null default false,
  add column if not exists verified_certification boolean not null default false,
  add column if not exists identity_checked boolean not null default false,
  add column if not exists review_count integer not null default 0,
  add column if not exists review_rating numeric;

comment on column public.affiliate_applications.profile_photo_path is 'Storage path for logo/photo shown on public profile.';
comment on column public.affiliate_applications.sample_report_paths is 'Storage paths to sample reports shared publicly.';
comment on column public.affiliate_applications.verified_insurance is 'Admin-verified insurance checkbox for public trust.';
comment on column public.affiliate_applications.verified_certification is 'Admin-verified certification checkbox for public trust.';
comment on column public.affiliate_applications.identity_checked is 'Admin-verified identity checkbox for public trust.';
comment on column public.affiliate_applications.review_count is 'Number of reviews shown publicly.';
comment on column public.affiliate_applications.review_rating is 'Average rating (e.g. 4.8).';

