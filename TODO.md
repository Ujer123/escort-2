# TODO: Implement Tags as Array in Profiles

## Tasks
- [x] Update lib/models/Service.js to add tags: [String] field
- [x] Update components/AdminProfileForm.js to include tags field in form state, UI, and submission
- [x] Update components/Footer.js to change footerLinks href to /tags/[tag] and add tags display section
- [x] Create app/tags/[tag]/page.js for tags page showing profiles with that tag
- [x] Update app/api/services/route.js to support filtering by tags in GET request
- [x] Test the implementation
