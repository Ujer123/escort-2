# Performance Optimization for Profile Detail Loading

## Current Status
- [x] Analyzed performance bottleneck in `/api/profiles/[slug]/route.js`
- [x] Identified inefficient query loading all services and filtering in memory
- [x] Found inconsistent slugify functions across codebase

## Tasks
- [x] Add `slug` field to Service model with index
- [x] Update `/api/profiles/[slug]/route.js` to query directly by slug
- [x] Update `app/profile/[slug]/page.js` to use consistent slugify function from lib/utils.js
- [x] Create `scripts/generate-slugs.js` to populate slugs for existing services
- [ ] Run slug generation script for existing data
- [ ] Test performance improvement
- [ ] Update other files using inconsistent slugify functions (ProfileCard.js, HomeCard.js)
