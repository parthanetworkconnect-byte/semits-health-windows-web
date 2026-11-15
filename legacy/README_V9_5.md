# SEMITS HEALTH V9.5 — DEVELOPMENT SOURCE

## Windows
1. Back up V9.4 using Settings > Export backup. V9.5 uses a separate local port and origin.
2. Close old windows; extract ZIP into new folder.
3. `py -3 -m pip install pypdf pymupdf pytesseract pillow` (OCR also requires the external Tesseract Windows executable).
4. Run START_WINDOWS.bat and open http://127.0.0.1:8773.
5. Import V9.4 backup if needed. Note: attachments are not part of structured JSON backup.

## Two modes
- **Healthy living:** profile-based age-aware lifestyle plan without medical records, TXT download. Rules are educational and not a medical screening.
- **Medical intelligence:** PDF extraction up to 50 MB and up to 80 pages. The server attempts OCR on all image-only pages (Tesseract required, potentially slow). Download full extracted text, review structured findings, confirm patient identity and generate report.

## Limitations
No medical diagnosis, validated abnormal-result classification, automatic identification verification, live medical literature matching, encryption, iPhone/Windows cross-device sync or practitioner approval. PDF OCR can misread results. The 1.2-million-character safety ceiling can truncate extremely large documents; page diagnostics signal possible failures. PDF bytes are handled locally by server and not stored server-side. The app is NOT appropriate for real confidential patient records without additional privacy protections.

## Privacy
Browser localStorage is origin-specific: port 8772 and port 8773 do not share records. Backups exclude attachments. Do not expose local server to the internet.
