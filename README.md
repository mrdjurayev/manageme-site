# ManageMe LMS

Personal LMS for subjects, schedule, attendance, assignments, submissions, and AI-based deadline review.

## Locked Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Vercel deployment
- OpenAI API for submission review

## 1) Local Setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
APP_LOGIN_USERNAME=
APP_LOGIN_PASSWORD=
APP_LOGIN_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Run app:

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

## 2) Stack Readiness Check

After setting env variables, open:

- `GET /api/system/stack-status`

This endpoint returns whether each required key exists (without exposing secrets).

## 3) Auth Security (Enabled)

Routes:

- `/login`
- `/dashboard` (protected)
- `/schedule` (protected)

Security behavior:

- Unauthenticated users are redirected to `/login`.
- Authenticated users cannot open `/login` again.
- Server actions re-check authenticated user for protected operations.
- Login is locked to one configured credential pair (`APP_LOGIN_USERNAME` + `APP_LOGIN_PASSWORD`).
- Locked login secrets are read from server env only (not hardcoded in source).
- Security headers are attached in middleware.
- Login server action has IP-based rate limiting. Use Upstash Redis env vars for distributed rate limiting across instances.
- Stack diagnostic endpoint is dev-only (`/api/system/stack-status` returns 404 in production).

## 4) Supabase Setup

1. Create a project in Supabase.
2. Copy project URL and anon key into `.env.local`.
3. Copy service role key into `.env.local`.
4. Run SQL migration file:
   - `supabase/migrations/20260304_000001_auth_profiles.sql`
   - `supabase/migrations/20260304_000002_seasons_subjects.sql`
   - `supabase/migrations/20260305_000003_schedule_attendance.sql`
   - `supabase/migrations/20260312_000004_set_active_season.sql`
5. These migrations create `profiles`, `seasons`, `subjects`, `schedule_lessons`, `attendance_records` tables with strict RLS policies.

## 5) Vercel Deployment

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add the same env vars in Vercel Project Settings.
4. Deploy.
5. Connect `manageme.site` in Vercel Domains.

## 6) Next Implementation Milestone

1. Assignment submission flow
2. AI review flow for submissions

## 7) Secret Safety (Enabled)

- `.env.local` is ignored by git and cannot be committed.
- `pre-commit` hook blocks commits that include:
  - `.env*` files except `.env.example`
  - OpenAI/Supabase secret-like values
  - `APP_LOGIN_PASSWORD` value
  - `UPSTASH_REDIS_REST_TOKEN` value
- `pre-push` hook rescans tracked files and blocks push if a secret-like value exists.

Helpful commands:

```bash
npm run setup:hooks
npm run check:secrets
```
