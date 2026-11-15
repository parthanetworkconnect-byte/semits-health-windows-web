# V9.4 — Failed-to-fetch repair
- Starts browser only once the local extraction server has successfully bound to port 8772.
- Separate port avoids accidentally using an old V9.1–V9.3 server on 8771.
- Adds GET /api/health and explicit connection check before any medical PDF upload.
- Replaces opaque network errors with actionable messages; adds 4-minute extraction timeout.
- Bumps offline cache version to avoid serving older JavaScript.
- Limits automatic OCR to 10 scanned pages (other pages require manual handling).
- No change to saved data schema; local browser storage is origin-specific, so records on port 8771 do not automatically appear on port 8772. **Export a backup from the old app and restore on the new version.**
- Keep the server window open; nothing is uploaded to an external server.
