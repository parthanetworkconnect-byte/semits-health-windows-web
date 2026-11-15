# SEMITS Health V524 R4.1 — Test Profiles & Daily Video (Windows trial)

## Changes from R4
- Adds **New & Switch Profiles** in the existing single-window sidebar.
- Supports up to 12 *synthetic adult test profiles*, each with separate encrypted profile, daily check-ins, history notes and gym entries. The existing R4 single-profile data is migrated non-destructively into the encrypted test-profile collection on first unlock. The active legacy record is updated when switching to preserve existing R4 views. **The older encrypted document vault remains shared and is NOT person-isolated.** Do not use real information.
- Adds photo upload for the selected synthetic profile (JPG/PNG/WebP under 4MB), resized and encrypted in browser IndexedDB with the rest of the test profile collection. A selected profile's picture appears in the banner, daily report and video.
- Adds **Daily Report Video V2** in the same application window: six scenes over 30 seconds, with optional in-browser original low-volume synthesized music and no narration. Separates recorded treadmill and strength entries, recorded lifestyle/food checkbox information, user-entered plans, and general recommendations.
- Exports **WebM** using MediaRecorder on browsers that support it. MP4 export is **not** built. No external audio, image, video or AI service required.
- Existing R4 menus, food reference library, report and calculated test data remain available.

## Installation
1. Extract to a NEW folder. Don't overwrite R4/R3 or older stable folders.
2. Stop the old SEMITS server (port 8783). Keep a backup of your existing trial vault before testing profile switches.
3. Double-click `START_SEMITS_HEALTH_V524.bat`.
4. Open http://127.0.0.1:8783/ on the same browser origin.
5. Unlock with your existing synthetic test passphrase.
6. Choose **New & Switch Profiles** to create test profiles and upload synthetic portraits.
7. Choose **Daily Report Video** to play or export a 30-second WebM animation from actual trial entries.

## Known limitations and safety
- Prototyping with synthetic test data ONLY. Not production-secure or clinically validated.
- The document vault is still a shared legacy vault and must not be used for multi-person clinical records.
- No reliable analysis of scanned medicine, imaging or lab records.
- No automatic completed-meal itemisation: the existing daily log only stores a general meals checkbox, not exact food. Planned foods are labelled planned.
- No face recognition, age/gender/ethnicity inference from photos. Photo upload does not prove the pictured person's identity or give consent.
- No automatic background daily video generation or email delivery when the app is closed.
- Browser WebM recording takes 30 seconds in real time and requires the tab to remain active. Video and music formats depend on browser support.
- Profile switching updates legacy active-record keys to keep R4 menus working. If the browser or old R4 version is used concurrently, records can diverge. Close old R4 tabs before switching.
- A full Windows browser end-to-end check has not been performed in the development environment.
