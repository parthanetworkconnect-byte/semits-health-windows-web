# SEMITS Health V9.8 — Food Photo & Meal Timing (prototype)

## Install / start on Windows
1. Export JSON backup from old V9.7 Settings & backup. Close old server.
2. Extract this ZIP to its own folder; do not replace previous directory.
3. Have Python 3 available (`py -3 --version`). Install `pypdf`; for scanned medical PDFs also install `pymupdf pytesseract pillow` and Windows Tesseract separately.
4. Run `START_WINDOWS.bat` then open http://127.0.0.1:8773 and refresh Ctrl+F5.
5. Use the new left menu **Food photo & timing** and **195-country foods**.

## Food photo flow
1. Select the profile, preferred food country/cultural background, shift type, activity and hours slept.
2. Capture photo with phone camera or choose image from files. The photo is not automatically recognised.
3. Confirm the meal type and actual mass, in grams/ounces/illustrative servings. Enter actual date/time. Optional location permission is not necessary and precise location is discarded immediately.
4. Click **Analyse verified meal & save** to display estimated nutrients and contextual notes. Data stays on the current browser/device.
5. Saved photo thumbnails are not in exported JSON backups. Download each photo separately.

## Accurate claims and limitations
- 195 selectable countries, but only 18 have curated country *example* data. Other entries are broad regional examples, **not validated local crops**. The page includes 12 generated illustrative ingredient photographs and emoji pictograms for other examples; not researched or source-attributed photos for thousands of foods.
- 27 starter food nutrition entries remain indicative; **not linked to USDA FoodData Central FDC IDs**.
- Meal calculator includes SIX illustrative examples: salad, chicken burger, bubble tea, sweetened drink, rice, fruit. Recipes vary markedly by food brand, preparation, sauces and measured serving. Salad bowl values are not inherently accurate.
- **No automatic AI photograph identification**, portion detection, barcode reading, vision API, background tracking, or image recognition in this source package. The menu requires the user to confirm dish and amount.
- No predictive diagnosis, disease risk score, medical or medication recommendation, or promise of health outcomes. Children and people with specific health needs require appropriately qualified guidance.
- No cloud accounts or encryption; browser localStorage stores review records and indexedDB stores compressed photo blobs; use synthetic records if testing on shared machines.
- Browser's local wall clock and zone drive meal context; geolocation requires permission and is not stored. Precise location is not required.
- Local HTTP server on port 8773 works on the same PC. An iPhone/Android on a different device needs HTTPS deployment and privacy/security hardening for actual camera and data sharing. **http://127.0.0.1:8773 on PC does not open that PC's app from a phone.**

## Evidence links (contextual and educational)
- WHO healthy diet https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet
- CDC/NIOSH diet for night shift https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod9/08.html
- CDC/NIOSH night shift sleep https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod9/05.html
- USDA FoodData Central dataset files https://fdc.nal.usda.gov/download-datasets/

## Validation
- `node --check app.js && node --check food_scan.js && node tests/food_scan_v98.js`
- `node tests/food_v97.js && node tests/global_v96.js && node tests/v95_check.js`
- Browser end-to-end test and iPhone/Android deployment not verified.
