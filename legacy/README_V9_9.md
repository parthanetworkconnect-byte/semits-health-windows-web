# SEMITS Health V9.9 — Medical ID, QR and Daily Plans

## Windows
1. Back up data from the previous application using Settings & backup. Exit the previous Python server.
2. Extract the ZIP. Install Python 3. Run `py -3 -m pip install pypdf qrcode[pil]`. For scanned PDFs also install `pymupdf pytesseract pillow` and Tesseract OCR executable.
3. Double-click `START_WINDOWS.bat`. Open http://127.0.0.1:8773. Refresh Ctrl+F5 (service worker cache updated).
4. Select a family profile, open Medical ID and generate its SEMITS reference ID. This identifier is permanent for that profile in local data. The QR encodes only the ID; no name, medical history or URL. You can scan the QR, copy the ID, then search it in this same app.
5. For an uploaded report, use Medical Intelligence, review the extracted patient ID and findings, create/match the profile, then save the evidence review. Select Daily health plan > Generate/refresh. For a person with no medical record, fill in Healthy Living and generate from their profile instead.
6. Download the daily plan as TXT and mark daily habits complete. Family profiles, tests and plans remain separate.

## Privacy and limitations
- The QR is NOT a national medical identifier, a digital medical record, a globally resolvable patient record or an authentication credential. It identifies a profile locally; copying the QR between devices does not move the records.
- Do not expose personal information through the QR. It includes only a random SEMITS reference. Do not replace it with a national patient ID or real-world contact data.
- The generated 7-day food and exercise suggestions are broad templates that adapt to age and explicitly entered medical context; they are NOT clinically personalised prescriptions or verified seven-day menus with nutrient totals.
- Medical result lines are shown as **unverified** text; the software does not establish abnormality, interpret images, diagnose a disease, prescribe medications, determine laboratory reference ranges or order scans. Clinicians should review actual tests, units, dates and medications.
- No records are uploaded to an external server by this package; sensitive profile data in browser local storage is not application-encrypted. Backups exclude attachments. Avoid live patient records on an unsecured/shared computer.
- `127.0.0.1` is local to this Windows computer. There is no cloud sync, login, mobile remote access or secure QR-based retrieval from phones.
- Previously saved SH-xxxxxxxx identifiers remain valid; QR rendering supports them. New profiles receive longer random SEMITS IDs.

## Sources in app
WHO physical activity, WHO healthy diet, Australian Government screening, NIDDK diabetes management. These references are static pointers, not a live evidence search.
