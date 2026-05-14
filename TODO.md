# Campus Closet — TODO

**Last updated:** 2026-05-14

---

## Critical for Launch

- [ ] **Configure Google OAuth in Supabase dashboard** (Authentication > Providers > Google)
- [ ] **Add real eboard Google emails to `AdminUser` table** (update `prisma/seed.ts` placeholders)
- [ ] **Email notifications on contact form submission** — Contact form writes to DB silently. Add email via Resend/SendGrid.
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
- [ ] **Admin user management UI** — No way for admins to add/remove other admins. Requires developer to run Prisma queries.

---

## Admin Editability Gaps (remaining)

- [ ] MissionSection: "OUR MISSION" label, "REDUCING CONSUMPTION", "Expanding Access", 3 pillar titles + descriptions
- [ ] AboutImpactStats: 6 stat labels, 3 equivalency descriptions
- [ ] SwapVsDrive: all comparison card content, guidelines heading
- [ ] FAQ category labels

---

## Post-Launch Improvements

- [ ] Pagination on admin lists
- [ ] Admin user guide for eboard

---

## Nice to Have

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Favicon format (convert `icon.jpg` to `.ico` or `.png`)
- [ ] Stale branch cleanup (merged remote branches)
