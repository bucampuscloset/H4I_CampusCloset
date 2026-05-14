# Campus Closet — Consolidated TODO

All pending tasks consolidated from NEXTSTEPS.md, FIX.md, and CLAUDE.md.

**Last updated:** 2026-05-14

---

## Critical for Launch

- [ ] **Configure Google OAuth in Supabase dashboard** (Authentication > Providers > Google)
- [ ] **Add real eboard Google emails to `AdminUser` table** (update `prisma/seed.ts` placeholders)
- [ ] **Email notifications on contact form submission** — Contact form writes to DB silently. Add email via Resend/SendGrid.
- [ ] **Add `NEXT_PUBLIC_STADIA_MAPS_API_KEY` to Vercel env vars** — Map tiles return 401 on production. Get key from https://stadiamaps.com/
- [ ] **Delete placeholder data from production DB** — placehold.co gallery photos, past-dated events, fake contact requests, internal planning meeting

---

## Important for Launch

- [ ] **Rate limiting on public form endpoints** — `POST /api/contact` has no rate limiting. Use `@upstash/ratelimit` or middleware throttling.
- [ ] **Security headers** — Add CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy via `headers()` in `next.config.mjs`
- [ ] **Cascade deletes on Event relations** — Deleting an Event orphans `GalleryPhoto` and `ImpactStats`. Add `onDelete: Cascade`.
- [ ] **Delete storage objects when deleting photos/team members** — DB record deleted but Supabase Storage file persists.
- [ ] **Server-side email validation** — `POST /api/contact` only checks non-empty. Add format validation.
- [ ] **OpenGraph image for social previews** — No `og:image` set.
- [ ] **Admin portal mobile responsiveness** — Fixed `w-64` sidebar with no responsive breakpoints.
- [ ] **Contact info in constants** — `campuscloset@bu.edu` and Instagram handle hardcoded in multiple files. Move to `constants.ts`.

---

## UI Fixes (Figma Alignment)

- [ ] **Events: add photo gallery** — Bare heading removed; need a gallery component pulling from `GalleryPhoto` table (reuse `PhotoGallery` from About page)
- [ ] **Events: SwapVsDrive card borders** — Should use `border-[3px] border-brand-dark-olive` (Swap) and `border-brand-blue` (Drive)
- [ ] **Events: SwapVsDrive title font** — Should be `font-body text-[36px] font-extrabold`
- [ ] **Events: Guidelines box border** — Should be `rounded-[20px] border-[3px] border-[rgba(197,184,174,0.8)]`
- [ ] **About: impact stat card borders** — Currently `border-2 border-brand-text` (heavy). Consider lighter borders.
- [ ] **Donate: Accept/Reject layout** — Figma shows unified card with vertical divider (currently two separate cards)
- [ ] **FAQ: "Still have questions?" background** — Currently cream, Figma shows darker olive-green

---

## Post-Launch Improvements

- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] Admin user management UI
- [ ] Pagination on admin lists
- [ ] Convert `Event.type` to Prisma enum
- [ ] Replace `Event.isPast` with date-based queries
- [ ] `ContactRequest.preferredDate` should be DateTime
- [ ] Privacy policy page
- [ ] Admin user guide for eboard

---

## Nice to Have

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Social sharing for events
- [ ] Favicon format (convert `icon.jpg` to `.ico` or `.png`)
- [ ] Loading skeletons (`loading.tsx` for route transitions)
- [ ] Stale branch cleanup (merged remote branches)
