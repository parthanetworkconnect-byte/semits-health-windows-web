# SEMITS Health V9.1 — Medical Intelligence (prototype)

## Start (Windows)
1. Extract the ZIP to a normal writable folder. Do not run inside the ZIP.
2. Install Python 3 and, once, `py -3 -m pip install pypdf`.
3. Double-click `START_WINDOWS.bat`; browse to http://127.0.0.1:8771.
4. Select **Medical intelligence** in the navigation.
5. Choose a selectable-text PDF or .txt medical report, press **Extract document text**, and manually correct the extracted content including all dates, reference ranges and measurement units.
6. Enter clinician-confirmed conditions, exact prescribed medication names and personalised goals. Select **Analyse reviewed information**.
7. Open the saved review and **Download report .txt**. Print to PDF using the browser if desired.

Use only *synthetic* example patient information when demonstrating. The application does not run a remote AI API or automatically query the web; it compares reviewed notes against FIVE bundled guideline references. Text matching is not semantic evidence retrieval or matched-patient research, and it makes no clinical diagnoses or treatment decisions. Clinical sources are linked so users can verify them, and the research set is not exhaustive.

## What is implemented
- Existing V9 dashboard, nutrition, exercise, family profiles, medical document vault, and backup remain.
- New Medical Intelligence menu, editable document text review, medication class caution prompts, condition/topic matching, guidance discussion points, citations, per-profile saved text reports, report download.
- Optional local PDF text extraction via `server.py` and `pypdf`; it uses loopback-only HTTP, does not save the uploaded extraction request on the server, accepts PDF <=8MB and <=80 pages, and limits extracted text.
- Plain text input handled locally in browser. Image-based PDFs, CT/MRI, scanned PDFs, handwritten notes, images, and prescriptions require manual transcription/clinical review (NO OCR or image interpretation).

## CRITICAL privacy warning
- Medical review text and report drafts are stored unencrypted in browser localStorage in this prototype. Anyone with access to this browser/device profile may be able to access them. **Do not store real sensitive health records on shared or untrusted devices or deploy this publicly.** The separate V9 medical-file vault uses IndexedDB and is also not app-encrypted.
- No login, MFA, access control, clinical audit, cloud sync, automatic data backup, regulatory compliance certification, encryption-at-rest or independent security review.
- The local Python server is not intended for deployment on internet-facing networks. Never bind it to 0.0.0.0. An HTTPS, authenticated service is required before any online deployment with real patient information.
- JSON exports include intelligence review text; handle securely. Original medical attachments are NOT included in JSON exports.
- Family profiles share browser storage and are NOT isolated by user authentication.

## Clinical safeguards
- Do not adjust or stop medication based on the report.
- Similarity means guideline **topic** matching, not patient similarity, patient outcomes or evidence of causation.
- The evidence library is *static* and can become outdated; confirm source dates and applicability with clinicians.
- Targets, dietary changes, exercise and test frequency require personal review, especially in diabetes, pregnancy, kidney disease, children, frailty, hypoglycaemia risk and complex comorbidities.
- Emergency or severe symptoms require local emergency/urgent medical help, not this app.

## Synthetic test scenario
Person: 55-year-old male; clinician-confirmed type 2 diabetes; medicine: metformin (illustrative only); goal: sustainably improve nutrition and activity; document note: 'HbA1c listed, confirm units and date'. Expected: diabetes-related evidence sources, discussion of A1C/BP/cholesterol/eyes/feet/kidneys, medication reconciliation and dietary/activity guidance without dose recommendations.

## Tests
- `node --check app.js`
- `node --check medical_intelligence.js`
- `node tests/intelligence_logic.js`
- Python `server.py` smoke test using pypdf-generated synthetic PDF.
- Browser-based smoke test provided in `tests/intelligence_smoke.py`, but browser navigation was blocked by the execution environment, so **not passed here**.
