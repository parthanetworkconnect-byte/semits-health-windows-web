# SEMITS Health V524 R3 — Unified Personal Health Dashboard trial

This build extends the separate V524 R2 trial without modifying the earlier released ZIPs or stable V522. It is a local testing prototype, **not** a production health record system or clinical AI.

## Windows install

1. Extract this entire ZIP into a **new** folder. Do not overwrite R2.
2. Double-click `START_SEMITS_HEALTH_V524.bat`.
3. Open **Personal Health Dashboard** in the sidebar.
4. Use the SAME test vault passphrase that was created on this browser's origin (`127.0.0.1:8783`) in V524 R2. If none exists, create a test vault in Healthy Living first.
5. Use only synthetic examples. Open the six tabs.

### Included
- Unified profile view shows current locally encrypted V524 R2 profile, calculations and food preferences.
- Medical records section enumerates the **existing** encrypted test-document vault, permits self-reported category, report date and note, and saves the classification encrypted. It **does not read or analyse** the contents of PDFs or scans.
- Medicines tab displays encrypted self-reported history records.
- Daily living tab displays encrypted recent check-ins.
- Health intelligence tab displays educational calculations and recorded symptoms, with missing-data caveats.
- Weekly report displays a seven-calendar-day snapshot and allows a TXT download. The export is unencrypted; protect it appropriately. The encrypted whole-vault backup remains available.
- White/grey visual layout, adapted to the original navigation. New content is in `unified.js`.

### Not included
User identity verification, multi-family separation, mobile synchronisation, on-device clinical LLM, OCR/PDF clinical extraction, medicine–food interaction evaluation, automatic email or SMS, validated medical decisions, or security certification. This trial keeps the R2 IndexedDB schema and reuses the same cryptographic key while unlocked. Browser extensions, malicious updates, stolen devices and cross-origin changes can affect security or access. Do not enter real patient records.

### Review notes
Data saved in R2 on **the same browser and exact address/port** can be read after entering its passphrase. New installations in a different browser or port require the encrypted backup import workflow in My Health into an empty vault. Export an encrypted backup before making browser changes. Plain-text TXT weekly reports must be handled separately.
