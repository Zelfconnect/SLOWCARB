# SlowCarb — QA Checklist (Pre-Launch)

> **Launch Date:** Sunday, Feb 23, 2026  
> **Days Remaining:** 7  
> **Last Updated:** 2026-02-16 18:30

---

## Visual QA (browser automation)

### All Screens - Basic Functionality
- [x] Home/Dashboard loads
- [x] Recipes list loads (35 recipes)
- [x] Recipe detail modal opens
- [x] Settings page loads
- [x] Learn page loads
- [x] Shopping/Ammo Check loads

### UI Bugs Fixed (16 Feb)
- [x] Back button contrast (white on green → white with dark icon)
- [x] Modal z-index (z-30 → z-40)
- [x] Header spacing (py-6 → pt-8 pb-6)
- [x] Modal header padding (p-5 → pt-6 px-5 pb-5)
- [x] Learn page spacing (space-y-6 → space-y-8)
- [x] Tab indicator (bolder underline on active)

---

## Functional Testing (to be done)

### User Flows
- [ ] **New user onboarding**
  - [ ] Complete profile setup
  - [ ] Select favorite recipes
  - [ ] See personalized dashboard
  
- [ ] **Weight tracking**
  - [ ] Add weight entry
  - [ ] Edit weight entry
  - [ ] Delete weight entry
  - [ ] View weight chart
  
- [ ] **Meal planning**
  - [ ] Mark meal as complete
  - [ ] See streak counter update
  - [ ] Check progress visualization
  
- [ ] **Recipe interaction**
  - [ ] Browse by category (Quick/Meal Prep/No-Time)
  - [ ] Filter recipes
  - [ ] Favorite/unfavorite
  - [ ] View ingredients tab
  - [ ] View instructions tab
  
- [ ] **Cheat day**
  - [ ] Select cheat day
  - [ ] See cheat day indicator
  - [ ] Cheat day messaging
  
- [ ] **Shopping list**
  - [ ] Generate from favorites
  - [ ] Check Ammo Check zones
  - [ ] Mark items as obtained

---

## Cross-Browser Testing
- [ ] Chrome/Chromium
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Edge

---

## Mobile Testing
- [ ] Touch targets (44px minimum)
- [ ] Scroll behavior
- [ ] Modal transitions
- [ ] Bottom nav accessibility
- [ ] Text readability

---

## Performance
- [ ] Initial load time (<3s)
- [ ] Recipe list rendering
- [ ] Modal open/close smooth
- [ ] No console errors
- [ ] No layout shift

---

## Notes

**Autonomous QA can handle:**
- Visual regression testing (screenshots)
- Functional flow testing (Playwright)
- Console error detection
- Performance metrics

**Needs manual review:**
- Copy/content quality
- Brand voice consistency
- Edge cases with real data
- iOS Safari quirks

---

**Last Run:** Not yet executed  
**Next Run:** Overnight when WORK.md includes "run SlowCarb QA"
