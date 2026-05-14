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

- [ ] **Events badge fixed width overflows** — `EventsPageClient.tsx:65` uses `w-[420px]` which overflows on mobile. Change to `w-full max-w-[420px]`
- [ ] **PhotoGallery bento grid not responsive** — `PhotoGallery.tsx:41` uses `grid-cols-3` with no mobile fallback. Should be `grid-cols-1 md:grid-cols-3` or a simpler 2-col layout on mobile
- [ ] **EventCalendar fixed widths** — `EventCalendar.tsx:119` uses `w-[35%]` and `w-[60%]` which squeezes on mobile. Should stack vertically with `md:flex-row`
- [ ] **MissionSection low mobile padding** — `MissionSection.tsx:31` uses `px-3` on mobile (very tight). Bump to `px-6`
- [ ] **EventsPageClient fixed margins** — `EventsPageClient.tsx:60,74` uses `m-[50px]` which leaves only ~275px on 375px screen. Change to `m-6 md:m-[50px]`
- [ ] **WhatIsCampusCloset icon too large on mobile** — `WhatIsCampusCloset.tsx:51` uses `h-[100px] w-[100px]`. Change to `h-16 w-16 md:h-[100px] md:w-[100px]`
- [ ] **GetInvolved icon too large on mobile** — `GetInvolved.tsx:51` uses `h-[80px] w-[80px]`. Change to `h-14 w-14 md:h-[80px] md:w-[80px]`
- [ ] **UpcomingEventsPreview calendar SVG too large** — `UpcomingEventsPreview.tsx:48` uses `h-[72px] w-[72px]`. Change to `h-12 w-12 md:h-[72px] md:w-[72px]`
- [ ] **SwapVsDrive padding not responsive** — `SwapVsDrive.tsx:25` uses `p-8`. Change to `p-4 md:p-8`

---

## Cross-Page Consistency Issues

### Page hero headings (should all be `text-[48px] md:text-[64px]`)

- [ ] Events: `text-[64px]` no mobile size — `EventsPageClient.tsx:61`
- [ ] Donate: `text-4xl md:text-5xl` (smaller than others) — `donate/page.tsx:95`
- [ ] FAQ: `text-[36px] md:text-[52px]` (smaller) — `faq/page.tsx:23`
- [ ] Contact: `text-[36px] md:text-[52px]` (smaller) — `contact/page.tsx:24`

### Section headings (should all be `text-[40px] md:text-[52px]`)

- [ ] About "Our Impact": uses `md:text-[54px]` — `about/page.tsx:46`
- [ ] Donate sections: uses `text-3xl` (too small) — `donate/page.tsx:111,186,210,225`
- [ ] Contact "Other Ways": uses `text-[28px] md:text-[36px]` (too small) — `contact/page.tsx:42`
- [ ] SwapVsDrive heading: uses `text-5xl` — `SwapVsDrive.tsx:17`
- [ ] PhotoGallery: uses `md:text-[48px]` — `PhotoGallery.tsx:36`
- [ ] TeamGrid: uses `md:text-[54px]` — `TeamGrid.tsx:29`

### Section padding (should all be `px-6 py-20 md:px-12`)

- [ ] Donate sections use `py-16` instead of `py-20` — `donate/page.tsx`
- [ ] FAQ hero uses unusual `pb-48` — `faq/page.tsx:21`
- [ ] SwapVsDrive uses `p-8` (not responsive) — `SwapVsDrive.tsx:16`

### Button inconsistency

- [ ] Donate "Contact Us" button uses inline className instead of variant — `donate/page.tsx:233`

---

## Admin Editability Gaps

~50+ user-facing strings are hardcoded and NOT editable from the admin portal. High priority items:

### Landing page (add SiteContent keys)

- [ ] WhatIsCampusCloset: heading, subtitle, 3 pillar titles + descriptions
- [ ] HowItWorks: heading, subtitle, 3 step titles + descriptions
- [ ] WhyItMatters: heading, body paragraph
- [ ] GetInvolved: heading, subtitle, 3 action card titles + descriptions
- [ ] GalleryPreview: heading, subtitle

### About page

- [ ] MissionSection: "OUR MISSION" label, "REDUCING CONSUMPTION", "Expanding Access", 3 pillar titles + descriptions
- [ ] AboutImpactStats: 6 stat labels, 3 equivalency descriptions
- [ ] TeamGrid: heading, subtitle

### Donate page

- [ ] Hero heading + subtitle, How to Donate heading + subtitle, 3 step titles + descriptions
- [ ] Drop-Off heading + subtitle, Schedule heading + subtitle, Questions heading + subtitle

### Events page

- [ ] Page heading + subtitle, badge suffix, upcoming heading + subtitle, no-events message
- [ ] SwapVsDrive: all comparison card content, guidelines heading

### FAQ page

- [ ] Hero heading + subtitle, "Still have questions?" heading + body, category labels

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
