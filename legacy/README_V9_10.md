# SEMITS Health V9.10 — Workout Photo Intelligence (development prototype)

## Install / run
1. Back up in Settings & backup from prior version. Photos in IndexedDB are NOT part of JSON backups.
2. Close all older SEMITS server windows; extract ZIP to a separate folder.
3. Run START_WINDOWS.bat, then open http://127.0.0.1:8773. Do not open index.html as a file; optional OCR requires server.
4. Refresh Ctrl+F5 if old app persists. Select Workout photo analysis.

## Scope
Upload photo from camera/gallery, select exercise from treadmill, weights, aerobics, Pilates, yoga, body composition etc. Optional local OCR returns raw unverified text; manually enter confirmed values. Save record and image to browser-local data, display non-diagnostic coaching, warnings and practical next actions. No image recognition, pose analysis, or clinical interpretation is performed.

### Optional image OCR
`py -3 -m pip install pillow pytesseract` and install Tesseract executable separately. It only reads approximate text; not structured automatic machine metrics. No OCR or images are sent to external APIs.

## Data/privacy
Photo image maximum 8 MB, stored in browser IndexedDB. Structured records stored in localStorage and JSON backup. This is **not encrypted**, is not suitable for confidential medical records on a shared device, and is not synchronised with phones. Browser/site storage deletion may erase data. Profile IDs are not identity authentication.

## Limitations
Cannot know exercise biomechanics from a static picture. Exercise machine calories are approximate. Body scan outputs depend on manufacturer and hydration; ask qualified clinician about flags. A photo is not independently matched to an individual's identity.
