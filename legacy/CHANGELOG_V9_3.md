# SEMITS Health V9.3 — Patient profile intake

- Selecting a PDF/TXT in Medical Intelligence now starts document text extraction automatically.
- Detects candidate patient name, age, sex, date of birth and source MRN/patient ID from common document-header labels.
- Shows all candidates for human verification; never guesses unavailable information.
- One-click reviewed create/match profile, with confirmation before profile creation/linking.
- Existing profile medical information is not overwritten. Conflicting age or sex blocks link.
- New profile receives a unique SEMITS Medical ID (not a government or hospital ID).
- Medical Intelligence analysis now requires patient identity confirmation first.
- Medical ID includes editable DOB and source MRN fields.

## Limitations
- Header-based recognition is heuristic and may miss or misread fields especially on low-quality scans.
- No identity authentication or patient-consent mechanism; local prototype only.
- No automatic diagnosis or clinician-validated lab result extraction.
- Browser data remains locally stored and is not encrypted. Do not use with real confidential health records.
- Full browser UI E2E checks blocked by environment policy; JS syntax and unit checks passed.
