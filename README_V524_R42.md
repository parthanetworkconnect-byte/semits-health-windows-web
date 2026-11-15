# SEMITS HEALTH V524 R4.2 — Smart Camera & Profile Management (TRIAL)

## New in this release

- Food Intelligence now opens with **Food Vision & Photo Journal**, using file selection, phone camera capture (`capture=environment`) or a live webcam where the browser permits it.
- Gym & Workouts now opens with **Gym Camera & Equipment Journal**. Users label an image and mark it Planned, In progress or Completed. A photo is not treated as proof of exercise.
- **Daily Selfie** is an in-app page. An opt-in selfie can be used as the circular portrait in the existing 30-second in-app report video; otherwise the profile picture is used.
- **New & Switch Profiles** now includes archive/restore and a deletion operation, which requires exact profile name plus confirmation.
- Uploaded photos are resized in the browser and stored in the existing AES-GCM encrypted trial profile collection. Each profile holds up to 18 image-journal entries. File selection accepts JPEG/PNG/WebP under 6 MB.
- Food Journal displays only *user-entered* calorie information and an illustrative maintenance-energy equation, NOT image-recognised nutrients or a medical diagnosis.
- The previous R4.1 animated 30-second in-app video and WebM export remain available.

## NOT IMPLEMENTED

- Food identification from pixels, food quantity/ingredient recognition, nutrient database integration, computer vision, plate-based metabolism estimation, or automatic personal clinical recommendations.
- OCR of treadmill consoles or strength-machine labels and machine-specific collision/injury or load assessment.
- Realistic person-generated exercise video, or MP4 export.
- **Independent passwords, independently encrypted family vaults, verified accounts or role-based permission controls.** The entire trial still uses one local vault passphrase and synthetic adult profiles.
- Deletion from previously exported backups, the older shared document vault, external devices or other browser origins. There is no remote sync.

## Installation

1. Extract this ZIP to a **new folder**. Do not replace R4.1.
2. Close any previous SEMITS server process using port 8783.
3. Run `START_SEMITS_HEALTH_V524.bat`. Keep the console open.
4. Open `http://127.0.0.1:8783` in Edge.
5. Unlock your synthetic trial vault using its prior passphrase.
6. Create a test profile in **New & Switch Profiles**, then open **Food Intelligence**, **Gym & Workouts**, **Daily Selfie**, and **Daily Report Video**.

## Security and testing

- New media journal entries are encrypted through the R4.1 collection in IndexedDB using the existing browser-side trial key.
- Images are never uploaded by the new R4.2 code; live camera access is prompted by the browser.
- If you share a plain WebM export, that file is NOT encrypted by SEMITS.
- Browser scripts were syntax-checked and previous static/calculation tests plus R4.2 static checks passed. Automated live browser execution was blocked by the environment, so Windows function testing remains necessary.
- Use **fake data and synthetic/consented test images only**. Do not use this as a medical or secure multi-user product.

## Preservation

R4.2 is distributed as a separate folder/ZIP and does not overwrite prior R4.1 source code or original V522/V523/R3 files. When the new app is opened at the same localhost origin, it accesses the same local trial vault; **export an encrypted backup first** if testing deletion or other destructive functions.
