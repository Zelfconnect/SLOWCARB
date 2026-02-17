# SlowCarb Launch Checklist - Feb 23, 2026

**Target:** Production deployment to https://slowcarb-new.vercel.app  
**Deadline:** Feb 23, 2026 23:59 CET

---

## 🐛 Bug Fixes (Pre-Launch)

### Critical (Must Fix)
- [ ] **PRD-001:** Back button contrast - RecipeDetailModal.tsx
  - Worker: 1114bf50 (Codex, in progress)
  - Status: 🔄 Running
  
- [ ] **PRD-002:** Z-index hierarchy - RecipeDetailModal.tsx + BottomNav.tsx
  - Worker: 1eb292b2 (Codex, in progress)
  - Status: 🔄 Running

### Polish (Should Fix)
- [ ] **PRD-003:** Header spacing - App.tsx main element
  - Worker: 7979856d (Codex, in progress)
  - Status: 🔄 Running

- [ ] **PRD-004:** Modal header padding - RecipeDetailModal.tsx
  - Status: ⏳ Queued (after PRD-001/002/003 complete)

### Optional (Nice to Have)
- [ ] Visual bugs from Kimi audit
  - Worker: 8ad74cad (Kimi K2.5, in progress)
  - Status: 🔄 Running
  - Will identify additional issues

---

## ✅ Verification Checklist

### Functional Testing
- [ ] All 5 tabs load correctly (Dashboard, Recipes, Learn, Shopping, Settings)
- [ ] Recipe list displays cards properly
- [ ] Recipe detail modal:
  - [ ] Opens on card click
  - [ ] Back button clearly visible
  - [ ] Z-index above nav bar
  - [ ] No content overlap
  - [ ] Close button works
- [ ] Bottom nav doesn't clip content
- [ ] Header doesn't overlap cards
- [ ] Onboarding flow works
- [ ] Shopping list functionality
- [ ] Favorites toggle works

### Visual Testing
- [ ] All screens pass Kimi visual QA
- [ ] No header overlap issues
- [ ] Proper spacing throughout
- [ ] Mobile viewport (375px, 390px, 428px)
- [ ] Tablet viewport (768px, 1024px)
- [ ] No text cramping
- [ ] No duplicate branding

### Performance
- [ ] Lighthouse score > 90 (performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] No console warnings (critical)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast ratios pass WCAG AA
- [ ] Focus indicators visible

---

## 🚀 Deployment Steps

### Pre-Deploy
1. [ ] All PRD fixes merged to main
2. [ ] `npm run build` succeeds locally
3. [ ] `npm run preview` manual smoke test
4. [ ] Git commit with descriptive message
5. [ ] Git push to origin/main

### Deploy to Vercel
1. [ ] Vercel auto-deploys from main branch
2. [ ] Monitor deployment logs
3. [ ] Check preview URL before promoting
4. [ ] Promote to production

### Post-Deploy
1. [ ] Visit https://slowcarb-new.vercel.app
2. [ ] Run through verification checklist
3. [ ] Test on real mobile device
4. [ ] Check Vercel analytics for errors
5. [ ] Monitor first 24h for issues

---

## 📊 Success Metrics

### Launch Day (Feb 23)
- [ ] Zero critical bugs reported
- [ ] < 5 minor issues logged
- [ ] Uptime > 99.9%
- [ ] No rollback needed

### Week 1 (Feb 23-29)
- [ ] User retention > 70%
- [ ] Average session duration > 5 min
- [ ] Crash rate < 0.1%

---

## 🚨 Rollback Plan

If critical issues found:
1. **Immediate:** Revert Vercel deployment to previous version
2. **Triage:** Identify failing component/PRD
3. **Fix:** Create hotfix PRD, spawn Codex worker
4. **Re-deploy:** After runtime verification
5. **Post-mortem:** Document what went wrong

Rollback command:
```bash
# Via Vercel CLI
vercel rollback

# Or via Vercel Dashboard
# Deployments → Previous Deployment → Promote to Production
```

---

## 📝 Notes

- All fixes must be **runtime verified** before marking complete
- Kimi QA is **mandatory** for visual verification
- Each PRD = **atomic change** (1 component, 1-3 lines max)
- Deploy window: **Feb 22 evening** (1 day buffer before launch)

---

## 🎯 Current Status

**Date:** 2026-02-16 15:31 CET  
**Days to Launch:** 7 days  
**Blocking Issues:** 0  
**In Progress:** 4 workers  
**Completed:** 0/4 priority fixes

**Next Action:** Wait for worker completions, then verify + deploy.
