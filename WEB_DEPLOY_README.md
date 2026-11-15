# SEMITS Health V524 R4.2 — Safari Web Edition (source-preserving port)

**Source:** original `SEMITS_HEALTH_V524_R42_SMART_CAMERA_PROFILE_MANAGEMENT_WINDOWS_TRIAL.zip` from 14 November 2026. This is a **static-web packaging of that actual source**, not V525 and not a new replacement implementation. No stable V522, R4.1 or V525 files were changed.

## How to publish
1. Create a **new** public GitHub repository named `semits-health-v524-r42-web`.
2. Unzip this package and upload **all contents**, including the `legacy` directory and every nested asset, to the repository root. Do NOT upload just the ZIP; the folder `legacy` must be alongside `index.html`.
3. On GitHub, `Settings > Pages > Deploy from a branch > main > /(root) > Save`.
4. Open `https://YOUR-USERNAME.github.io/semits-health-v524-r42-web/` in Safari.
5. On iPhone, Safari > Share > Add to Home Screen.

## Important limitations
- This port exposes the original R4.2 web UI, local-only encrypted **trial** profiles, Food Vision photo journal, gym photo journal, Daily Selfie, profile archive/delete, 30-second animated in-app report video and WebM export (subject to browser support). It does NOT implement food recognition, treadmill OCR, clinical AI, real workout-generated videos, or independent secure family accounts.
- Some **legacy** tools relied on a Windows/Python local HTTP server (for example `/api/...` operations). Those tools **will not function on GitHub Pages**, even if their pages appear. This package does not pretend otherwise.
- The original R4.2 documentation is retained in `README_V524_R42.md`; it details features and restrictions.
- This is a *public, unaudited prototype*. Use synthetic profiles, food/activity entries and sample images only. DO NOT upload real medical data or secrets to GitHub, or enter them into this hosted trial.
- Browser storage is specific to the current website origin. **Existing Windows/localhost data will not automatically appear**. Also, V525 vault data is not automatically compatible.
- A public GitHub Pages site can load updated JavaScript, which threatens any browser-managed secrets if code is compromised. This port is not a certified medical vault.
- Safari camera access requires permission and HTTPS; recording/export format and webcam behavior may vary across devices.

## Directory layout
- `index.html` — R4.2 entry point
- `app.js`, `living.js`, `unified.js`, `r4.js`, `r41.js`, `r42.js` — original web logic
- `style.css`, `r4.css`, `r41.css`, `r42.css` — styles
- `legacy/` — retained historic food and research UI, assets, and datasets
- `.nojekyll` — instructs Pages to serve these static assets without Jekyll processing

## Checks
Static asset presence, JavaScript syntax (Node, where available), archive integrity. **No real-device end-to-end Safari or cryptographic security audit performed**.
