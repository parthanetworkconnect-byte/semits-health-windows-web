# SEMITS Health V9.14 + Food Intelligence V519 — Integrated release

Source: user-provided V9.14 SOURCE_LINKED_FOOD_REPAIR zip. Original V9.14 app modules are preserved; app.js adds only a new menu entry and renderer.

## Launch
1. Extract the complete ZIP.
2. Open `SEMITS_HEALTH_V9/START_WINDOWS.bat` and keep its console open.
3. Open `http://127.0.0.1:8773` in Microsoft Edge or Chrome.
4. Navigate to `516-food research library` on the sidebar.
5. Browse 516 entries, compare eligible foods, and download a separate food PDF.

The **original** 561-food catalogue is still accessible via the original `Food intelligence` menu entry. The imported V519 catalogue is distinct and has 516 records. It is not a replacement for the original 561 entries.

The integrated module is included under `food_intelligence_516/` along with all 516 PDF files and JSON/CSV source data. Preserve this directory when copying the application.

## Privacy and safety
- Original V9.14 health data key `semits_health_v9` remains unchanged.
- Opening the app under a new host/port or moving to a different browser origin may show different locally stored data; export a backup first.
- Imported 181 profiles are source drafts. Other 335 are preliminary and are not independently verified master reports. Real licensed photographs are not fully embedded.
- The nested V519 app and original V9.14 page run on the same local server.
- Existing PWA service worker cache version updated to load changed core pages; the large PDF library is not precached.
