# Sam in Amsterdam — Production Scaffold

This repo is a ready-to-deploy Next.js app (App Router) with Tailwind, Mapbox, Supabase, and a daily events cron at **08:00 Europe/Amsterdam**.

## 0) What you'll get
- Pages: Home, Photos, Map (Mapbox), Blog, Events (daily topline), Notes (guestbook), Trip Planner, Classes (private)
- Gentle animated gradients, clean minimal UI
- Supabase for data + auth + storage
- Vercel Cron job calling `/api/events/refresh` daily
- Domain ready: `saminamsterdam.com`

## 1) Create accounts (owner: samuel_chachkes@brown.edu)
- **Vercel**: https://vercel.com/signup
- **Supabase**: https://supabase.com/
- **Mapbox**: https://account.mapbox.com/
- **Resend** (email): https://resend.com/  (or Postmark)

## 2) Environment variables
Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase project)
- `SUPABASE_SERVICE_ROLE` (for server-side tasks if needed)
- `NEXT_PUBLIC_MAPBOX_TOKEN` (Mapbox account → Access tokens)
- `RESEND_API_KEY` **or** `POSTMARK_TOKEN`
- `NEXT_PUBLIC_SITE_URL` should be `https://saminamsterdam.com`

## 3) Supabase schema
In Supabase SQL editor, run `supabase/schema.sql`.

## 4) Local dev
```bash
npm i
npm run dev
```

## 5) Deploy to Vercel
- Import the repo into Vercel
- Add the env vars in Project Settings → Environment Variables
- Vercel will set up the **Cron** based on `vercel.json` (08:00 UTC offset is handled by Vercel; this is fine for AMS — if you prefer exact Europe/Amsterdam clock time through DST, adjust the cron in Vercel dashboard).

## 6) Domain
- Buy `saminamsterdam.com` (Namecheap/Google Domains).
- In Vercel → Domains, add `saminamsterdam.com`; Vercel will give you DNS records.
- Paste DNS records at your registrar; wait for propagation (up to ~30 min).

## 7) Mapbox map
- Put your token in `.env.local`
- The map is centered near Houthavens (your address stays private).
- You can switch styles (e.g., `mapbox://styles/mapbox/light-v11`) in `app/map/page.tsx`.

## 8) Events job
- The route `app/api/events/refresh/route.ts` is called daily.
- Fill in your sources (Ticketmaster, Eventbrite, Meetup, Resident Advisor, museums).
- Save events to Supabase table `events`, then revalidate the `/events` page.

## 9) Admin/CMS
- In the next commits we’ll add UI to manage posts, photos, pins, classes, trips, and notes with magic-link login.
- Comments require email sign-in.

---

If anything feels rough or you want a change in vibe, tell me — we can tweak fast.
