# SEMITS Health V9.2 — Medical PDF import fix

## Why the screenshot showed “Document is over 8 MB”
The V9.1 Medical Intelligence screen imposed an 8 MiB browser restriction, and its Python extraction server enforced the same 8 MiB ceiling. V9.2 raises the Medical Intelligence PDF processing limit to **50 MiB** on both sides.

## Install
1. Close the running V9.1 command window (not only the browser tab).
2. Extract this ZIP to a **new folder**, not into the previous one.
3. Install `py -3 -m pip install pypdf`.
4. For scanned CamScanner PDFs, also install `py -3 -m pip install pymupdf pytesseract pillow` and install the Windows **Tesseract OCR executable** separately. Ensure `tesseract.exe` is on PATH. OCR is optional.
5. Double-click `START_WINDOWS.bat`; refresh the browser using Ctrl+F5.
6. Open Medical Intelligence, choose the PDF, and click Extract document text. Verify all extracted values manually before analysing.

## Limitations and privacy
- PDFs up to 50 MiB, 80 pages; 120,000 characters returned to browser; only first 12,000 characters copied into the review textarea. OCR only attempts the first 30 image-only pages, 12 seconds per page.
- Some PDFs with scanned images will still be unreadable without Tesseract or may yield OCR errors. Extraction and OCR accuracy are **not clinically validated**.
- Medical ID's **Save document** feature still has an 8 MiB limit because it stores attachments in the browser's IndexedDB. Raising that separately requires attachment storage and backup redesign. Use Medical Intelligence for larger PDF extraction.
- Documents are sent only to the local loopback server for transient processing, not uploaded to an external provider. The browser stores any saved review text in local browser data without medical-grade encryption. Use synthetic records for testing.
- V9.2 is an upload bug-fix, **not live literature search or diagnostic AI**.
