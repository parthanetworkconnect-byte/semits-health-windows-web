# SEMITS Health V523 R3 Windows Standalone Trial

1. Extract into a **new folder**, not V522 or your prior V523 trial folder.
2. Double-click `START_SEMITS_HEALTH_V523.bat` (Windows 10/11 with PowerShell).
3. Open My Health. Use synthetic test files and a test passphrase; export an encrypted test backup.
4. To test import, use a new browser profile with no existing SEMITS trial vault, and import using the original passphrase.
5. Only the browser profile where files were created contains local IndexedDB. Extracting the app elsewhere does not copy stored records.

No real medical records. This is a cryptography demonstration, not secure production E2EE. See `CHANGELOG_R3.md`, `README.md`, and `ARCHITECTURE.md`.
