# SEMITS Health V9.11 — Workout OCR launch and review repair

1. Back up previous profiles from Settings & backup first.
2. Extract the ZIP, then run `START_WINDOWS.bat`. DO NOT double-click index.html.
3. Open `http://127.0.0.1:8773` in your browser. Leave the server terminal window open.
4. Install optional OCR: `py -3 -m pip install pillow pytesseract` and separately install Tesseract OCR for Windows, ensuring `tesseract.exe` is on PATH.
5. For body scans, upload the original report/export or a tightly cropped image at full resolution, NOT a screenshot of a small image viewer.
6. Press Read numbers from photo. OCR text and tentative matches appear, with a review-only button to fill EMPTY fields. OCR-derived fields are always marked unverified. Correct fields before saving.
7. Where OCR fails, enter at least one verified measurement or session note manually. Do not infer values from photos.

Health data saved from a `file://` origin cannot be transferred automatically to `http://127.0.0.1` origin. JSON backup does not include the underlying attached photos. Clinical diagnosis, exercise form recognition, and automatic verified scanning are NOT implemented.
