# SEMITS Health V524 R4 — Universal Single-Window Windows Trial

## Start

1. Extract into a **new folder** (do not overwrite V522/V523/R3).
2. Close any previous SEMITS trial using local port 8783.
3. Double-click **START_SEMITS_HEALTH_V524.bat**. Windows launches the local static server and opens http://127.0.0.1:8783.
4. Go to **My Health Hub**, unlock with a **test** vault passphrase of at least 12 characters and select **Medical Profile**. Use synthetic details only.
5. Save an adult test profile. Open **My Day** to see a basic wellness plan, add a test check-in, and view the colourful daily report.
6. Open **Gym & Workouts** to log treadmill sessions and strength sessions.
7. Open **Reports** to see daily and seven-day summaries, select a report date, and export TXT. To preserve data, use **Encrypted vault backup**.

## What is working in this R4 trial

- **One main window:** fixed sidebar, central workspace, menu changes without normal pop-up GUI windows. Existing local HTML reference workspaces embed within the centre pane; external research websites remain external.
- **Universal-style onboarding:** age, height, weight, goal, estimated activity, chosen equation, food pattern, city/location, cultural meal preference, exclusions, symptom flags, identity (optional). The **calculation implementation is adult-only** (18–100); it does not cover every person's physiology.
- **Local encrypted storage:** reuses the earlier V523/V524 browser IndexedDB vault on the same exact origin (including port) for existing profile, check-ins and medical notes. Gym records are encrypted in a new vault record.
- **Basic rule-based nutrition and activity guidance:** general, visibly non-clinical, adjusted by goal, diet and reported conditions.
- **Daily reports:** automatically recomputed when opened or when a daily entry is saved; report colours react to logged activity/energy/symptoms/meal checkbox. The data shown is actual logged trial data, not invented metrics.
- **Seven-day reports:** logged days, missing-data count, mean recorded weight, mean sleep, activity; gym entries shown separately to avoid double-counting.
- **Gym logging:** treadmill time, speed, incline, optional HR, estimated constant-speed distance; strength exercise, machine name, load, sets, reps, optional seat setting, volume.
- **Medical notes:** encrypted, self-reported test conditions, medicine schedules, supplements and allergy entries.
- **Food & science:** packaged R3/R2 food and research references remain present (516-food library and legacy V522), accessible from the sidebar. The older legacy screens are not fully redesigned.

## Not working or not clinically validated

- No real medical diagnostic engine, local clinical LLM, radiology interpretation, automatic PDF/CT scan extraction, drug–food interaction evaluation or prescribing.
- No live city-wise agricultural feed, confirmed local shop inventory, country-of-origin verification, complete nutrient database integration or automatic per-person calorie prescriptions.
- No device-treadmill/wearable connectivity, gym animations or licensed exercise demonstration pictures yet; pictograms are placeholders.
- No production verified accounts, separate family vaults, independent penetration test, medical-device regulatory clearance, mobile app, cloud sync or continuous background delivery of daily reports.
- This uses one **test profile per browser vault**. It is not a released universal medical app.
- The UI has coloured adaptive cards, but no generated portrait that changes by identity or ethnicity yet; automatically inferring appearance from ethnicity would be unreliable.
- No proof of clinical superiority versus competing apps. Windows browser end-to-end tests were not possible in this environment.

## Data safety

- **Do not enter real medical records or patient identifiers.** For synthetic trial data only.
- Data is stored in your local browser storage for that exact host and port. Clearing site data may erase everything unless a backup was made. Changing the port or browser creates a different vault.
- Keep your test passphrase safe. The backup includes ciphertext; individual TXT reports exported to Downloads are **not encrypted**.
- Consult qualified healthcare professionals for symptoms, injuries, medicine interactions and disease-specific plans.

## Validation

- `node --check r4.js` passed.
- Existing `node tests_v524.js` passed ten calculation assertions.
- `node test_r4_static.js` passed navigation/rendering/rule tests using DOM stubs.
- ZIP integrity to be checked at packaging. No Windows PowerShell runtime or browser end-to-end verification has been completed in this environment.

## Change control

R4 adds `r4.js`, `r4.css`, `README_V524_R4.md`, and uses separate ZIP output. R3 ZIP and the stable V522/V523 ZIPs are unchanged. R4 retains the original V524 profiles and IndexedDB data schema on the same origin; it does not perform a migration. This prototype should be treated as a development branch.
