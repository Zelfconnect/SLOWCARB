# AGENTS.md

## Cursor Cloud specific instructions

This is a fully client-side React SPA (no backend, no database, no Docker). All state is in localStorage.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Test | `npm run test` |
| Build | `npm run build` |

Standard commands are documented in `CLAUDE.md` — refer there for architecture details, design system, and coding rules.

### Non-obvious caveats

- **Landing page gate:** Navigating to `http://localhost:5173` shows a marketing landing page (`LandingPage.tsx`), not the app. Append `?app=1` (e.g. `http://localhost:5173?app=1`) to reach the actual application and onboarding flow.
- **Onboarding on first visit:** The app shows an onboarding wizard on first load (no localStorage profile). Complete the wizard to reach the dashboard. To reset, clear localStorage key `slowcarb-user-store`.
- **Vite default port:** Dev server runs on port 5173 by default. Pass `--host 0.0.0.0` if you need external/container access.
- **No `.env` required:** The project has zero environment variables. No secrets or API keys are needed.
- **Playwright installed but unused:** `playwright` is a devDependency but there are no E2E test files or config. Ignore it.
- **Test stderr noise:** The `useUserStore` test intentionally triggers a `SyntaxError` log for corrupted JSON — this is expected, not a failure.
