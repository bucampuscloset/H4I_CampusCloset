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

## Mobile Responsiveness Issues

- [x] ~~Events badge fixed width overflows~~ — Changed to `w-full max-w-[420px]`
- [x] ~~PhotoGallery bento grid not responsive~~ — 2-col on mobile, bento on desktop
- [x] ~~EventCalendar fixed widths~~ — Stacks vertically on mobile
- [x] ~~MissionSection low mobile padding~~ — Bumped to `px-6`
- [x] ~~EventsPageClient fixed margins~~ — Responsive `mx-6 md:m-[50px]`
- [x] ~~WhatIsCampusCloset icon too large~~ — `h-16 w-16 md:h-[100px] md:w-[100px]`
- [x] ~~GetInvolved icon too large~~ — `h-14 w-14 md:h-[80px] md:w-[80px]`
- [x] ~~UpcomingEventsPreview calendar SVG~~ — `h-12 w-12 md:h-[72px] md:w-[72px]`
- [x] ~~SwapVsDrive padding~~ — `p-4 md:p-8`

---

## Cross-Page Consistency Issues

### Page hero headings — all standardized to `text-[48px] md:text-[64px]`

- [x] ~~Events~~ — fixed
- [x] ~~Donate~~ — fixed
- [x] ~~FAQ~~ — fixed
- [x] ~~Contact~~ — fixed

### Section headings — all standardized to `text-[40px] md:text-[52px]`

- [x] ~~About "Our Impact"~~ — fixed
- [x] ~~Donate sections~~ — fixed
- [x] ~~Contact "Other Ways"~~ — fixed
- [x] ~~SwapVsDrive heading~~ — fixed
- [x] ~~PhotoGallery~~ — fixed
- [x] ~~TeamGrid~~ — fixed

### Section padding — all standardized to `py-20`

- [x] ~~Donate sections~~ — fixed
- [x] ~~FAQ hero~~ — fixed
- [x] ~~SwapVsDrive~~ — fixed

### Button inconsistency

- [x] ~~Donate "Contact Us"~~ — Added `tan` variant to Button, replaced inline styles

---

## Admin Editability Gaps

### Landing page — DONE

- [x] ~~WhatIsCampusCloset: heading, subtitle, 3 pillar titles + descriptions~~
- [x] ~~HowItWorks: heading, subtitle, 3 step titles + descriptions~~
- [x] ~~WhyItMatters: heading, body paragraph~~
- [x] ~~GetInvolved: heading, subtitle, 3 action card titles + descriptions~~
- [x] ~~GalleryPreview: heading, subtitle~~

### About page — PARTIAL

- [ ] MissionSection: "OUR MISSION" label, "REDUCING CONSUMPTION", "Expanding Access", 3 pillar titles + descriptions
- [ ] AboutImpactStats: 6 stat labels, 3 equivalency descriptions
- [x] ~~TeamGrid: heading, subtitle~~

### Donate page — DONE

- [x] ~~Hero heading + subtitle, How to Donate heading + subtitle, 3 step titles + descriptions~~
- [x] ~~Drop-Off heading + subtitle, Schedule heading + subtitle, Questions heading + subtitle~~

### Events page — PARTIAL

- [x] ~~Page heading + subtitle, upcoming heading + subtitle, no-events message~~
- [ ] SwapVsDrive: all comparison card content, guidelines heading

### FAQ page — DONE

- [x] ~~Hero heading + subtitle, "Still have questions?" heading + body~~
- [ ] Category labels

### Additional gaps (not yet addressed)

- [ ] Admin user management UI — no way for admins to add/remove other admins

---

## Post-Launch Improvements

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
