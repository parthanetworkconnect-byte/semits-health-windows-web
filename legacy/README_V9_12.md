# SEMITS Health V9.12 — Global Food Intelligence

## Install
1. From the previous app, export Settings & backup JSON (photo attachments are not part of JSON backup).
2. Close older SEMITS Health servers.
3. Extract this archive fully. On Windows, double-click START_WINDOWS.bat; do not open index.html directly.
4. Open http://127.0.0.1:8773. Refresh Ctrl+F5 if an older version is cached.
5. Click Food intelligence; use category dropdown/search and select a food card to inspect it. The existing 195-country explorer is a separate menu.

## What is actually implemented
- 561 distinct named foods in 13 category families, filterable and searchable with 48 cards at a time.
- 10 approximate ingredient photographs from prior builds, plus category illustrations for the other entries. Category illustrations are **not** accurate food images.
- 27 rounded illustrative nutrient entries carried over from V9.7; all others explicitly display missing nutrients; no invented nutrient values.
- Serving-gram calculation only when a sample reference is present.
- General food-group benefit, digestion, allergen, cooking/cultivation, and safety discussion notes with visible uncertainty.
- Preserves previous Medical Intelligence, QR ID, workout/photo, family, food scan and global longevity modules.

## NOT implemented or verified
- This is NOT a globally exhaustive edible-food database. Not all 561 entries have individual lab-confirmed calories, exact USDA/AFCD food IDs, original-crop country mapping, supplier GMO certification or medically assessed digestion rates.
- Allergen tags are incomplete screening hints, NOT an allergy-clearance service. Cross-contamination and additional allergens matter.
- The app does not identify poisonous plants, mushrooms or wild species from a photograph. DO NOT consume unknown species based on the app.
- No automatic ingredient-image recognition; food photographs are illustrative.
- No automatic patient-specific metabolic modelling, diagnosis, or therapeutic claims.
- No external network API required; the UI works offline, server needed for PDF/OCR modules.

## References (future source integration)
- USDA FoodData Central: https://fdc.nal.usda.gov/download-datasets/
- AFCD food nutrient database: https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files
- FSANZ allergen information: https://www.foodstandards.gov.au/consumer/foodallergies
- WHO diet guidance: https://www.who.int/news-room/fact-sheets/detail/healthy-diet

## Data privacy
All profile data is browser-local. Before restoring a backup, retain a separate backup copy; treat shared computers as unsafe for sensitive medical documents. There is no app-level encrypted data vault.
