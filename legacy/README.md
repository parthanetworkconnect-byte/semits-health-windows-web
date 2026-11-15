# New: V9.1 Medical Intelligence

See **MEDICAL_INTELLIGENCE_README.md** for updated Windows setup, evidence matching and important privacy limitations.

# SEMITS Health V9 — integrated offline-first development prototype

**Status:** Working source-code prototype, not a deployed service, clinician-certified device, native iOS app, or Windows EXE. V8 full source code was not available in the current task, so V9 is a rebuilt continuation of the features previously described, **not** an in-place V8 migration.

## What works

- Olive-green responsive dashboard (desktop and phone)
- Family profiles (10+ age field), profile-specific food, gym, vitals, sleep, weekly checklist, and Medical ID
- Indian meal reference selector, manual kcal/protein entry, water diary and workout logs
- Medical ID with allergy, medication, emergency contact and notes fields; print view
- PDF/image upload storage (max 8 MB/file) using local IndexedDB; reopen/download documents
- Manual food photo notebook (not AI photo interpretation)
- Private notes journal hidden behind a **visual gate only** (not password-protected/encrypted)
- JSON export/import for structured records, with restore validation
- Installable progressive web app (PWA) manifest and cache service worker on HTTPS/localhost
- Runs without third-party JavaScript dependencies or remote APIs

## Windows — start

1. Unzip the package into a permanent folder (do not run from inside the ZIP).
2. Double-click **START_WINDOWS.bat**. It requires Python 3 in PATH and opens `http://localhost:8771`.
3. If your browser does not open automatically, enter `http://localhost:8771` manually.
4. Keep the command window open while you use the app. Close it to stop the local server.
5. Use your browser's **Install app** feature, where supported. Your records are stored in that browser's local storage/IndexedDB, not in the ZIP folder.

Alternative: in the extracted folder run `python -m http.server 8771 --bind 127.0.0.1`.

## iPhone — install

iPhone cannot directly run the Windows batch launcher. Host the same extracted files on a trustworthy HTTPS static website (with a secure/private deployment strategy appropriate for sensitive health information). In Safari, visit that HTTPS address, then **Share → Add to Home Screen**. Safari may install it as a web app. First load requires internet; cached app assets may work offline after successful installation. Data entered on the iPhone **does not sync** with Windows or other phones. To move structured records between devices, use Settings → Export/Restore; medical attachments and photos are **excluded** from JSON backups.

Do **not** publish identifiable health information, exports, or medical documents to a public GitHub repository. This project includes no medical record uploads to cloud servers.

## Privacy and storage caveats

- Data is saved in `localStorage` and `IndexedDB` in the current browser's storage area. **No app-level encryption, login, Face ID gate, family member permissions, audit logs or encrypted cloud backup.** Anyone with access to the unlocked browser profile can access the stored records.
- Private journal unlock is only a visual hide/show control; it is **not** a security boundary.
- Sensitive data should not be used in this prototype for confidential clinical workflows. If testing, use fictitious data.
- Browser storage can be removed by clearing site data, changing browsers/devices, or under browser storage management. JSON backups are unencrypted and **exclude original medical and food-photo files**. Download each attachment independently before clearing site data.
- This is not a medical diagnosis system. Nutrient numbers and activity plans are illustrations/manual entries; there is no validated calorie AI, OCR, medical interpretation, personalised risk score, clinical screening, automated alerts or notifications.
- For children: the sample activity view is not a prescription and family data access is not restricted. Requires adult supervision and appropriate professional guidance.

## V8 and older data

V9 uses browser storage key `semits_health_v9` and does **not** change V7 or V8 keys. Automatic V7/V8 data migration is NOT supported because the exact V8 source, keys and schema were not available. Do not delete previous files/storage; restore is only compatible with a V9 JSON backup.

## Development and tests

- JS syntax: `node --check app.js`
- Local automated checks: `node tests/check.js`
- Optional interactive smoke test: `python tests/smoke.py` (requires Playwright/Chromium; browser launch/network policy may block the test in some environments).
- This project has not been run and validated on physical Windows or iPhone devices.

## Next release candidates

1. Offline document-included encrypted backup and explicit password/PIN and device access handling.
2. Verified V8 import after obtaining its source/archive and schema.
3. Secure authentication, hosted sync, parental permissions with privacy review.
4. Optional approved medical document extraction and nutrition estimates with verifiable human review.
5. Native notification integration and tested iOS/Windows packaging.
