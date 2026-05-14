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
- [x] ~~**Contact info in constants**~~ — Already editable from Admin > Content > Footer & Contact via SiteContent system

---

## UI Fixes (Figma Alignment)

- [x] ~~**Events: add photo gallery**~~ — Reuses `PhotoGallery` from About page
- [x] ~~**Events: SwapVsDrive card borders**~~ — Brand-colored 3px borders applied
- [x] ~~**Events: SwapVsDrive title font**~~ — Now `font-body text-[36px] font-extrabold`
- [x] ~~**Events: Guidelines box border**~~ — Updated to `rounded-[20px] border-[3px]`
- [x] ~~**About: impact stat card borders**~~ — Lightened to `border border-gray-200`
- [ ] **Donate: Accept/Reject layout** — Figma shows unified card with vertical divider (currently two separate cards)
- [x] ~~**FAQ: "Still have questions?" background**~~ — Changed to dark olive with white text

---

## Post-Launch Improvements

- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] Admin user management UI
- [ ] Pagination on admin lists
- [x] ~~Convert `Event.type` to Prisma enum~~ — Already done in schema
- [x] ~~Replace `Event.isPast` with date-based queries~~ — Removed from schema and all code
- [x] ~~`ContactRequest.preferredDate` should be DateTime~~ — Already DateTime in schema
- [ ] Privacy policy page
- [ ] Admin user guide for eboard

---

## Nice to Have

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Social sharing for events
- [ ] Favicon format (convert `icon.jpg` to `.ico` or `.png`)
- [x] ~~Loading skeletons~~ — Added `loading.tsx` for all public and admin routes
- [ ] Stale branch cleanup (merged remote branches)
