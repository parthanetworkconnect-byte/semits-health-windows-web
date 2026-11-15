# SEMITS Health: Personal Medical History and Evidence Intelligence — implementation roadmap

## Completed in V524 R2 local trial
- One encrypted browser-local adult profile; daily check-ins and medical-history notes, an on-demand seven-calendar-day report and unencrypted text export. This is not a production clinical system.
- Trial encrypted vault supports document attachment storage only, NOT text extraction or clinical interpretation.

## Next system: design, NOT implemented
1. Identity: verified account, identity key, one medical record ID per user, family access grants, consent ledger, device key rotation and recovery. Do not derive a stable medical ID from personal identifying information. Local on-device AI default and no online inference without explicit consent.
2. Medical document intake: local encrypted PDF/image/DICOM ingestion; signed hashes; EXIF stripping in exports; file provenance; OCR / text parsing with extraction confidence; user confirmation; human/clinician verification for medications, allergies, lab values. Store originals and extracted facts separately. DICOM should be read by specialised software, not interpreted by generic OCR alone.
3. Standardised FHIR-style medical data: Patient, Observation, Condition, MedicationStatement/MedicationRequest, AllergyIntolerance, DiagnosticReport, ImagingStudy, DocumentReference, Procedure, CarePlan, Provenance, Consent. Maintain units (UCUM), time, source document/page, original interval-specific reference range and method; do not equate missing tests with normal tests.
4. Medical and lifestyle fusion: correlate symptoms, clinical context, current and discontinued medicines/supplements, meals (with portions), alcohol/caffeine, oils and cooking methods, sleep, shifts, activity load and lab trends. Never claim causal effects from correlations or infer unmeasured blood analytes from food logs.
5. Evidence engine: versioned clinical recommendations and provenance from WHO, Australian NHMRC/Healthdirect, TGA, peer-reviewed research and other authorised sources. Mayo Clinic and WebMD are useful patient explanations but not substitutes for primary guidance. Respect copyrights, licences, updates and local jurisdiction.
6. Complementary systems: Ayurveda, Siddha and Unani may be searchable as cultural/traditional reference material, distinctly labelled for quality/evidence and safety; no equal-evidence claims; check interactions/contamination, and never replace evidence-based treatment.
7. Clinical decision support: conservative education and flags, not diagnosis, oncology management, kidney protein/potassium/fluid restrictions, liver treatment, or autonomous medication dosing. Escalation logic for chest pain, syncope, severe breathlessness, acute symptoms, suspected eating disorder, and rapid unexplained weight loss. Pregnancy, children and advanced disease need separate professional pathways.
8. Food safety and nutrient reasoning: verified food composition per edible portion and preparation method, measured or estimated serving sizes, nutrient calculations with uncertainty, per-person allergies, supplements and contraindications; no black-box deterministic 'food effects on a particular body'.
9. Weekly reports: seven-calendar-day completeness, weight (averages and trend when enough points), waist, BP if entered, sleep, energy, symptom flags, measured nutrition, activity and recovery. Show uncertainty/missingness; no auto medication changes. User-approved schedule and opt-in private notifications after suitable secure delivery is implemented.
10. Testing: threat model, independent security audit, data minimisation/privacy, clinical safety testing, representative validation datasets, accessibility, and regulatory/legal assessment before production with real patient data.

## Patient safety
A high-intelligence personal plan may recommend prompts to ask a clinician, but cannot assume a lab is normal without laboratory-specific reference intervals or safely recommend changing prescribed medication. For kidney or cardiac disease, fluids and exercise may require individual restrictions. No promises of disease cure or longevity.

## Authoritative starting references
- WHO physical activity: https://www.who.int/initiatives/behealthy/physical-activity/
- Australian medication safety and reconciliation: https://www.safetyandquality.gov.au/national-standards/nsqhs-standards/medication-safety-standard
- US FDA clinical decision support boundaries: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software
- NCCIH on Ayurveda safety: https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth
