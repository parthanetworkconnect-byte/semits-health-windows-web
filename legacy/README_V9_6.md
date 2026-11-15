# SEMITS Health V9.6 — Global Health & Longevity Intelligence

## What is new

Global Longevity replaces the India-centred Healthy Living screen and works **without medical documents**. The user selects their **preferred cuisine** from Mexican, Malaysian, Chinese, French, American, Indian, Japanese, Mediterranean, African-inspired or Other/mixed, and enters optional country, self-described cultural identity, dietary restrictions, work schedule, food access, personal motivation, health conditions and activity goals. Each age-eligible profile generates seven days of meal examples, physical activity, long-term habits, preventive-care discussion questions and evidence links. Saves remain in the user's local browser profile.

This release preserves the existing Medical Intelligence and family modules from V9.5, including PDF OCR processing. The prior version's medical-analysis limitations still apply.

## Install on Windows

1. **Back up existing profiles** with Settings & Backup. Do not delete the previous version.
2. Extract the ZIP to a new folder (avoid nested folders) and open `SEMITS_HEALTH_V9`.
3. Double-click `START_WINDOWS.bat` (Python 3 must be installed).
4. Open `http://127.0.0.1:8773` in Edge or Chrome if needed. Keep the server console open.
5. If the old UI is cached, close the old tab and use Ctrl+F5, or clear this site's cache only. Local browser data uses the same origin/port, but always export a backup before upgrading.

For scanned PDF OCR, the optional Tesseract and pypdf/PyMuPDF/pytesseract/Pillow dependencies from V9.5 still apply. No AI web research backend is included in V9.6.

## Important limits

- This is a **rule-based, offline-first educational prototype**, not clinician-approved medical software.
- No automated search of death records, centenarian cohorts, connected devices, scientific registries, or new peer-reviewed literature.
- No prediction of life expectancy, medical diagnoses, ethnicity-derived clinical risk or personalised screening intervals.
- Meal examples are general examples, not nutritionally calculated complete diets. Where allergies are declared, example meals are withheld pending individual verification. Religious dietary compliance, gluten-free status and cross-contamination are not independently verified.
- Culture and ethnicity are optional and never used to infer biological needs; only **chosen cuisine** controls the example menu.
- Under-18 users need guardian review; no adult calorie/weight-loss recommendations.
- Local storage is not an encrypted medical-record system. Do not test with confidential records until a secure system exists.
- Reports are TXT files. No automated monitoring or reminders are sent.

## Evidence sources

WHO Healthy Diet 2026: https://www.who.int/news-room/fact-sheets/detail/healthy-diet
WHO Physical Activity: https://www.ncbi.nlm.nih.gov/books/NBK566046/
Australian 24-hour guidelines: https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians
WHO ICOPE: https://www.who.int/publications/i/item/integrated-care-for-older-people-%28-icope%29-guidance-for-person-centred-assessment-and-pathways-in-primary-care
NIA healthy ageing overview: https://www.nia.nih.gov/health/healthy-aging

## Tests

From `SEMITS_HEALTH_V9` run:

```
node tests/global_v96.js
node tests/v95_check.js
```

See `TEST_RESULTS_V9_6.txt`. Browser/end-user clinical validation is not claimed.
