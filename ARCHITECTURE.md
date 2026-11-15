# SEMITS Health V523 — Privacy-First Universal Medical Intelligence

**Document:** SH-ARCH-523-R2  
**Status:** Approved requirements merged into an implementation specification; **not built or deployed**  
**Date:** 13 November 2026  
**Immutable baseline:** SEMITS Health V522; **no modification or migration of V522 permitted**.

## 1. Product goal and safeguards

Build one connected health education, personal health record, evidence search and Food Intelligence platform for responsive web, Windows, iOS and Android. Present five simple top-level navigation areas, and make specialized medical capabilities available through submenus and universal search. Provide scientifically traceable, age-appropriate information and user-controlled privacy.

SEMITS must not represent itself as an autonomous physician, substitute for urgent assessment, guarantee longevity to 130, autonomously prescribe, or direct users to stop prescribed medicines. Claims and clinical-decision features require clinical validation, independent review and applicable regulatory assessment.

## 2. Non-negotiable security decisions

1. Public registration with email verification, abuse protection, secure sessions, passkeys and optional multifactor authentication.
2. User-key-controlled end-to-end encrypted medical vaults: files and sensitive records are encrypted **on authorised devices before upload**, with the server storing ciphertext only in normal operation.
3. On-device medical document AI only by default. Never transmit uploaded medical records or decrypted personal data to OpenAI, Anthropic, or any other externally hosted AI service. No silent fallback to cloud AI.
4. Encrypted cross-device synchronisation; trusted-device provisioning, revocation, key rotation, and explicit recovery that does not create a platform master decryption key.
5. Individual user and family profile isolation, guardian permissions and explicit consent for each sharing scope. Administrators cannot browse user medical records.
6. Public food and medical research content lives separately from private health records; public knowledge retrieval may use external source APIs without medical-identifying data.
7. Maintain accessible correction, export, deletion, audit, source-provenance and incident-response capabilities.
8. No V522 source, data, settings or deployment changes for this specification.

**Threat boundary:** E2EE protects server-stored records but cannot guarantee protection of data on compromised endpoints, metadata, screenshots, malicious client updates, or information users explicitly share. Browser-delivered application updates require hardening and supply-chain controls. A zero-access server cannot recover lost user-held keys without a separate user-controlled recovery mechanism.

## 3. Simplified five-menu information architecture

### 1. My Day
- Welcome / Today's overview
- Personal wellness plan
- Next meal / Meal planner
- Food and hydration diary
- Activity, sleep and recovery
- Monitoring routines and reminders
- Progress, trends and follow-up questions

### 2. Food Intelligence
- Food Intelligence home
- Existing 516 food research profiles, images and individual PDFs
- Original 561-food catalogue, deduplicated by canonical food IDs
- Nutrient explorer and portion calculations
- Food scanner with user confirmation
- Compare foods, recipes and cooking methods
- Food and health-context matching
- Food-drug safety information from reviewed sources
- Country/cultural food connections

### 3. My Health
- Personal and family profiles, consent and permissions
- Encrypted health records and medical documents
- Disease Intelligence: infectious, non-communicable, inherited, rare, autoimmune, neurological, mental-health, emerging and uncertain conditions
- Medicine Intelligence: names, indications, safety, labels, interactions and Australian medicine references
- Treatment Knowledge: established treatment, investigational care, supportive care and evidence status
- Disease Management: health monitoring, documented care plans, safe lifestyle support and professional follow-up
- Laboratory tests, imaging, vaccinations, vital signs and health history
- Medication reconciliation and allergy history
- Local clinical-context review (educational only)

### 4. Discover & Longevity
- Global health intelligence, geography-aware public health guidance
- 195-country foods and cultural recipe exploration
- Food origins, agriculture and preparation
- Disease prevention and public health education
- Life-stage education from infancy through older adulthood, with guardian controls
- Healthy ageing, nutrition, physical activity and sleep
- Traditional knowledge clearly separated from established clinical evidence

### 5. Science & Research
- Universal search across public disease, medicine, treatment and medical learning material
- Clinical guidelines, systematic reviews, trials and literature search
- MBBS Academy: anatomy, physiology, biochemistry, pathology, pharmacology, microbiology, public health, medicine, surgery, paediatrics, O&G and specialties
- Rare disease and emerging condition research
- Food master research PDFs and nutrition references
- Evidence grading, limitations, citation links, corrections and revision history
- Research source and licensing audit

Persistent universal controls: search, SEMITS Assistant (local-only for private records), profile switch, privacy controls, notifications and settings.

## 4. Proposed authoritative external source interfaces

Sources are **candidates for review**, not claims of completed ingestion. Check API terms, licensing, data reuse, freshness, geography and possible query privacy issues before connecting.

| Source | Content/use | Special constraint |
|---|---|---|
| WHO ICD-11 | Disease terminology and classification | API terms/versioning and mapped codes |
| NIH NCBI/PubMed/PMC | Research citations and permitted open full text | Do not treat all publications as licensed full text |
| openFDA | US drug labels, events, recalls | Safety reports do not prove causation or treatment suitability |
| TGA Australia | Australian medicines and product information | Medicine identity, regulatory status and current advisories |
| Healthdirect Australia | Consumer health education | Respect content licensing and attribution |
| WHO SMART Guidelines | Structured clinical recommendations | Only implement reviewed, context-appropriate guidance |
| ClinicalTrials.gov | Registered clinical trials | Registration does not mean efficacy |
| OpenStax | Openly licensed education | Per-work licence and attribution checks |

The original supplied document also proposed an OpenAI medical-intelligence integration. **Superseded for private data:** this architecture prohibits transmission of personal medical content to third-party AI by default. Public information retrieval can be performed without uploading patient context, preferably via curated/sanitized queries and local indexes.

## 5. Main data entities and boundaries

**Private, encrypted client-side:** person profiles, diagnoses reported by users, symptoms, medicines, allergies, lab results, images, uploaded documents, health history, logs, individual care-plan documents, local AI outputs, sharing rules as sensitive payloads.

**Server-visible minimum metadata:** account ID, verified contact, credential public metadata, device public keys, ciphertext object IDs/sizes, version stamps, encrypted key envelopes, minimal operational audit events, encrypted sharing memberships as feasible. Server must authenticate and authorise every object operation.

**Public/curated research data:** canonical food records, nutrients, photographs and licence metadata, public disease taxonomy, medicine reference records, clinical source metadata, licensed educational content, citation and evidence appraisal records.

**Key entities:** accounts, verified identities, devices, encrypted vaults, vault membership/key envelopes, encrypted objects, consent events, security events, canonical foods, food nutrient records, geographic recipe entries, disease codes, medicine identifiers, evidence sources, clinical trial records, evidence assessments and content review history.

## 6. Uploaded medical document analysis workflow

1. User signs in, chooses the correct authorised personal/family profile and selects a PDF/image.
2. Locally validate file type/size, and isolate untrusted document parsing.
3. On-device extraction identifies dates, lab tests, values, units, medicine names, dosage *as written*, source page and uncertainty.
4. Show extracted facts, document pages and uncertain readings for explicit user correction/confirmation; do not fabricate missing entries.
5. Save confirmed information encrypted in the appropriate profile and maintain a dated history.
6. Retrieve applicable **public** clinical evidence without disclosing identifiable personal health context.
7. Run locally reviewed rules for relevant units, missing inputs, allergies and potential medicine/food concerns; distinguish source facts, user statements and model interpretation.
8. Produce an explainable educational report with citation/version metadata, uncertainties, general nutrition information, urgent warning situations, and questions for a clinician.
9. Encrypt the generated report locally; synchronise ciphertext only.

**Nine review dimensions:** diagnostic context; patient factors; allergies; medicines/supplements; guidelines/evidence; potential benefit/harm; practical circumstances; monitoring/follow-up; communication/safety. This is a *clinician-style structured checklist*, not autonomous medical diagnosis or prescribing.

## 7. Clinical content rules

- Mark condition status: documented diagnosis, user-reported concern, possible finding or unresolved; never silently convert an AI inference into a diagnosis.
- Categorise interventions: standard established care; conditional guidance; investigational treatment; traditional/historical use; no established cure; evidence insufficient.
- Explicitly distinguish human studies, animal/cell studies, adverse-event signals and manufacturer labels.
- Display last reviewed dates and jurisdiction; old or unsupported information must not masquerade as current guidance.
- Disease-specific nutrition or medicine interactions require validated source and applicability rules; missing kidney function, pregnancy information or medication list must be reported as unknown.
- Emergency or potentially serious findings trigger clear escalation guidance rather than dietary self-treatment instructions.
- Include clinician-review pathways and regulatory assessment for any future patient-specific treatment decision function.

## 8. Security engineering and implementation choices

- **Crypto:** established audited primitives; authenticated file encryption (e.g. AES-256-GCM with safe nonce management), per-object keys, signed device-key enrollment, locally wrapped key envelopes, rollback/version protection. Cryptographic specifics must be selected and threat-modeled by specialists before coding.
- **Device:** iOS Keychain/Secure Enclave when appropriate, Android Keystore, supported OS-protected credentials, protected local databases. Browser limitations and malicious code update risks must be disclosed.
- **Identity:** passkeys WebAuthn/FIDO2, email verification, rate limits, session rotation and revocation, account recovery independent of vault recovery.
- **Sync:** ciphertext uploads, object-level server auth, conflict/version control, encrypted backups, multi-device approval and secure revocation.
- **Network:** no external model endpoints in medical document flow, outbound request tests, no sensitive logs/analytics/notifications, strict browser CSP and signed builds.
- **Application:** shared UI where appropriate, native device security adapters, offline-first private workflows; separate public knowledge services.
- **Assurance:** independent penetration testing, mobile/web security verification, clinical content validation, privacy impact assessment and appropriate legal/regulatory advice.

## 9. Acceptance criteria (release gates)

- New accounts cannot sign in until verification and rate-limit checks pass.
- The server and support staff cannot read sample encrypted patient documents from storage.
- Cross-account and cross-profile object access attempts fail by server-side authorisation.
- Packet/log inspection confirms zero external AI transmissions of patient plaintext.
- Offline analysis works for documented supported devices; unsupported devices fail safely without cloud fallback.
- Incorrect lab values and OCR failures are shown as uncertain, with page-linked correction.
- Every clinical content claim presented as established is linked to valid, reviewed supporting evidence.
- Critical emergency escalation scenarios and medicine interactions are safety-tested.
- Device provisioning, key recovery and revocation are independently verified.
- Security controls are assessed against OWASP ASVS and MASVS, with critical/high issues resolved.
- V522's working menus, 516 PDFs, food images, original modules and data remain intact; regressions are blocked.
- Privacy, children's rights and clinical software regulatory obligations are reviewed for target jurisdictions.

## 10. Phased delivery (separate V523 implementation)

A. Preserve V522 baseline; private V523 branch, source inventory and regression tests.  
B. Build five-menu shell and universal search, connecting existing public modules.  
C. Design and implement identity, key handling, encrypted vault and secure recovery.  
D. Implement secure multi-device ciphertext synchronisation and private family permissions.  
E. Index licensed public disease/medicine/treatment/MBBS/research sources with evidence provenance.  
F. Add on-device medical extraction and locally generated explanatory reports.  
G. Connect verified food data and condition-aware nutrition education safely.  
H. Build mobile clients and offline-first functionality.  
I. Conduct penetration testing, scientific/clinical review, privacy assessment, staged deployment and post-release monitoring.

**Scope confirmation:** this document is a planning artifact, not a security certificate, implemented module, working authenticated server or an alteration to V522.
