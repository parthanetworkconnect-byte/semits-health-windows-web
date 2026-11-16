# SEMITS Health V524 R4.3 — Universal Personal Guide (experimental branch)

## Purpose
Preserve the original R4.2 Windows-developed web modules and add a first-time assisted profile interview and coordinated, conservative wellness-plan generator. This is **not** a clinically validated medical AI system, does not diagnose causes of pain and must not prescribe treatment or medication.

## Implemented on development branch
- New **Personal AI Guide** navigation route, appended to original menu, without replacing the Windows UI.
- Adult-only first-time intake: goals, age, height, weight, activity level, bedtime/wake time, dietary preferences, experience, preferred activity days, multiple health conditions and preferred activities, pain-related questions and symptom warning signs.
- Locally generated, rule-based educational starting plan: eating, workouts, cardio, sleep, weight-trend monitoring, pain-aware adjustments, appropriate referral advice, daily follow-up.
- Explicit warning-sign and escalation logic for concerning neurological symptoms, chest symptoms and severe breathing problems. Emergency escalation is generic and assumes Australia for 000.
- Answers encrypted to the existing R4.2 *trial* encrypted IndexedDB vault using a per-profile record ID where applicable. Not an independently isolated user account.
- Responsive form and offline-installable PWA shell (manifest, service worker and icon reused from original source). Installation availability varies by browser; full testing pending.
- No external API calls from the new guide.

## Not implemented — essential production blockers
- No medical image recognition, diagnostic AI, symptom cause determination, healthcare-provider integration, prescriptions, automatic referrals or clinically reviewed care algorithms.
- No account registration/login, email verification, passkeys, multi-device identity verification, secure family vault separation or automatic encrypted cloud sync.
- No independent penetration test, clinical safety evaluation, threat model review, privacy impact assessment or regulatory review.
- No secure user-admin service, verified recovery infrastructure or production-grade monitoring.
- No physiological modelling beyond the older R4.2 estimate calculations. Avoid describing the rule-based guide as clinical AI.

## Three proposed recovery paths — DESIGN ONLY, NOT ACTIVE
1. **Offline one-time recovery key:** Generate a separate high-entropy vault recovery secret; wrap vault data key with it; show once to user; require verification of its saved copy. Never store the plaintext recovery key on the server.
2. **Trusted device recovery:** A separately authorised existing device can approve new-device enrolment with explicit authenticated key transfer and an auditable process. Device revocation is required.
3. **User-controlled encrypted backup:** Export encrypted vault along with authenticated and documented restoration requirements and an independently held recovery secret; test recovery and migration. Do not silently reset encryption with email alone.

Email verification may restore a login account; it cannot recover cryptographic data without an authorised recovery key or trusted device. Do not build developer backdoors or master decrypt passwords.

## User / developer distinction
- Current R4.2/R4.3: user unlocks a **local browser vault using a trial passphrase**, not an online account. No developer admin login exists.
- Future production: user enrolment, secure admin panel, passkeys/MFA, account recovery, consent, role separation, device revocation, audit logs and independently audited end-to-end encryption.

## First-use path
1. Install/open SEMITS PWA via browser; start at **My Day**.
2. Unlock a **test-only** local trial vault via existing **My Health Hub**.
3. Open **Personal AI Guide** in navigation.
4. Complete fictional intake and select **Generate my starting plan**.
5. Review suggested plan and high-priority clinical warnings when applicable.
6. Use original **My Day**, **Gym & Workouts**, **Food Intelligence**, and reporting modules for actual logged trial activity. Automatic repeated plan tuning from every daily record is not yet implemented.

## Safety limitations
- Back pain after Pilates can arise from many causes. A profile questionnaire cannot establish cause. The prototype screens for urgent red flags, encourages stopping aggravating movements and appropriate GP/physio assessment, and avoids diagnosis, medical prescriptions and detailed rehabilitation regimens.
- Medical conditions, pregnancy, medications and symptoms require clinician review when changing fitness/nutrition plans.
- Never use real personal medical records or photos on this unaudited public code prototype. Do not put medical data in GitHub commits/issues.
- Existing R4.2 main / live GitHub Pages are unchanged. Branch intentionally requires separate preview deployment and user acceptance before merging.

## Requirement 6 — targeted hypertrophy for experienced gym users (implemented as educational prototype)
- Onboarding includes **Targeted glute & shoulder development** goal, years of resistance-training history and typical workout duration; the assistant considers previous routine and preferred days.
- If the goal is targeted muscle development and training history is at least two years, a safety-aware starting programme proposes glute and shoulder work twice weekly, exercises, initial hard-set volume, appropriate food/protein intake and regular progress review.
- Example scenario: a 47-year-old woman with five years of training, 90-minute daily gym routine and a goal of maintaining weight while developing glutes and shoulders. Proposed 7-day allocation: Mon glutes A, Tue shoulders A, Wed recovery/mobility, Thu glutes B, Fri shoulders B, Sat other groups or light cardio, Sun rest. Training volume should depend on prior workload, symptoms and recovery, not simply exceed her current 90-minute sessions.
- Expected outcomes: strength/technique often improve first; visible muscle development is individually variable and may require several months. No guarantee of exact hip/shoulder shape, weight outcome, or timeframe.
- The assistant should confirm equipment, exercise tolerance, dietary restrictions, available recovery days and injury history before providing a highly specified load prescription. Menopause/perimenopause and relevant clinical conditions may warrant additional context without stereotyping.
- If red flags, worsening pain or relevant medical cautions are reported, safety messaging supersedes hypertrophy goals.
- **Not implemented:** an adaptive motor-control coach, true AI body-photo interpretation, automatic periodised load decisions, accurate personalised calorie expenditure or clinical diagnosis.

## Requirement 7 — broad lifelong wellness and condition-aware planning (prototype expansion)
- Goals now include maintenance, healthy fat loss, weight gain, strength and muscle growth, glute/shoulder shaping, body recomposition, general fitness, rehabilitation-informed activity, condition-aware wellness, women's health/menstrual wellbeing, mobility/balance and custom combined goals.
- Multi-select body areas: whole body, glutes/hips, shoulders, arms, back, chest, core, legs, balance/function and cardio endurance. Other health flags cover menstrual changes, menopause/perimenopause, recovery from illness/injury, neurological and mobility conditions.
- The guide now handles a **5–17 year old screening path** conservatively, not by applying adult calorie targets, weight-loss programmes or heavy-load prescriptions. The existing core living engine remains **adult-only (18–100)**; paediatric clinical calculations or actual personalised treatment are **not implemented**. Infants and children under five are not covered.
- For adults requesting muscle growth or recomposition, strength guidance can reflect selected target areas while accounting for pre-existing conditions, injury concerns and training experience; it is not a full periodised training planner.
- For women's health, the assistant suggests recording menstrual changes and seeking evaluation for persistent irregularity, amenorrhea, heavy bleeding or severe pain; it does not promise cycle correction through exercise.
- For illness recovery, physiotherapy and condition management, the assistant cannot identify medical cause from data entry, prescribe therapy, replace treating-clinician instructions, or claim to treat/cure disease. A clear safety escalation supersedes other plans.
- Roadmap: validated age-specific guidelines, maternity considerations, clinical screening, supported assistive devices, physio provider-prescribed exercise imports, consented integrations, human clinical oversight, and appropriate regulatory review are required for clinical deployment.
- This remains a **local, rules-based educational demo** and all real personal data should stay out of this unaudited prototype.

## Requirement 8 — Medical Intelligence Engine (new prototype workspace)
**Now implemented:** Medical Intelligence menu route, browser-local plain-text (.txt) and pasted-report import, naive laboratory value parsing and explicit possible-medication-line parsing, encrypted record history using existing experimental IndexedDB vault, record deletion, and local document-question evidence retrieval with report title and date. Each extracted figure is marked unverified, and no clinical assessment is claimed. All use is limited to fictional data until security and safety assessment.

**Not yet implemented:** PDF import, scanned-PDF OCR, image uploads, handwriting recognition, validated lab units/reference ranges, medication identification, drug interactions, medical knowledge retrieval, semantic AI conversations, clinician review, external referrals, medical codes (FHIR/LOINC/SNOMED CT/RxNorm), longitudinal clinical decision support, structured source citations, user-consented online research, or autonomous integrated plan changes.

**Target architecture:** On-device PDF text extraction (open-source PDF.js), optional on-device scanned-document OCR (Tesseract.js or a carefully evaluated local OCR model), layout reconstruction, evidence provenance with source file/page/bounding box, clinically validated structured extraction, user confirmation of extracted data, encrypted historical timeline, evidence retrieval from approved medical research with up-to-date URLs, privacy-preserving local language model when technically feasible, consent-gated private model inference, clinician escalation, and user-approved feedback to Personal Guide. Open-source code licenses and privacy implications require evaluation. Internet access by itself does not authorise sending patient documents to remote AI services.

**Safety:** OCR, semantic interpretation and reference intervals can be wrong; require unit, date, patient, modality and reference-range validation and human review before clinical conclusions. Medication-related answers require pharmacist or prescriber confirmation. Never diagnose or offer prescription changes from an uploaded report. No developer backdoors to the vault. Do not include real medical information in a public repository or deploy real-data ingestion on this unaudited static proof of concept.

## Medical Intelligence enhancement — incremental experimental implementation
- New module `r43_medical_extensions.js` adds browser-only text extraction from PDFs (via dynamically loaded PDF.js) and OCR for standalone images (via dynamically loaded Tesseract.js). Scanned image-only PDF pages now use an experimental OCR fallback (up to five pages per file). This OCR path has not been browser-tested and requires manual source verification. Text extraction requires page-by-page verification. External package CDN versions require verification and self-hosting before any real health data is used.
- Adds *public-topic-only* Europe PMC scientific literature search. It does not send medical records to literature service, and does not assess study quality.
- Adds *public-drug-name-only* openFDA label lookup (US drug-label source, not an Australian prescribing service or interaction checker). It does not send medication history.
- Adds comparison of numeric values for identical test labels and units in local encrypted trial records, with dates, documents, and arithmetic differences. It must not infer disease progression or clinical significance.
- The new Medical Intelligence module can show extracted content for user confirmation and can store confirmed-by-user textual trial records in existing browser vault. A source-linked, non-diagnostic plan-review checklist is now implemented. However, a fully intelligent plan-generation feedback loop is **not** implemented: the personal guide and document workspace are still separate, and no report can silently change a diet, exercise or medication plan.
- Technical limitations: no secure account backend, authenticated recovery, patient health record integrations, clinical interaction checker, audited data retention, image report understanding, medical diagnosis or treatment. The current browser prototype is unsafe for real patient records. The current CDN-loader potentially allows external code to execute in the app context, and must be replaced with reviewed, pinned, self-hosted assets and a strict Content Security Policy.

## Implementation accuracy check (2026-11-16)
- Development-only version includes PDF text extraction, limited image OCR, limited OCR fallback for image-only PDF pages, Europe PMC public-topic search, openFDA US drug-label search, same-test/same-unit arithmetic trends and an evidence-linked plan-review checklist.
- These modules were checked for JavaScript parse validity and successful GitHub commit/linkage, **not yet end-to-end tested in a browser**. Dependencies use external CDN and may be blocked by browsers, CORS, or security controls; must self-host and pin before production. No health documents should be used to test.
- Distinguish medication label lookup from validated **multi-drug interaction analysis** (not implemented).
- Distinguish evidence-title lookup and deterministic retrieval from clinically safe **AI explanation** (not implemented).
- Distinguish a pre-plan safety checklist from autonomous **medical-record-informed wellness recommendations** (not implemented).
- True secure verified accounts, recovery key flow, trusted device recovery, encrypted account sync and admin controls require security-designed backend and are not implemented in this branch.

## Requirement 9 — Food Intelligence Studio: profile optional, two data-entry modes
**Implemented:** New `Food Intelligence Studio` navigation route; manual meal entry, optional photo preview (no inference or photo persistence), confirmed dish/ingredient and side selections, drink assessment, cooking method/oil amount/temperature/cookware/heat source, and qualitative benefits, limitations, preparation and food safety. The entry can be saved as a structured fictional meal within the existing encrypted local trial vault (scoped by trial profile ID). Works with or without an existing basic health profile; health records are not required. Includes specific educational notes for char kway teow, rice/dhal and chicken/rice alongside a generic unknown-recipe fallback.
**Not implemented:** Computer-vision identification, segmentation, portion calibration, nutrient database integration for plate photos, accurate personalised kcal/macronutrient quantification, real-time cooking instructions based on food images, cross-device sync, or automated food-driven updates to the SEMITS Personal Guide.
**Principles:** Never claim that photo analysis can identify hidden cooking oil, sauces, allergens, preparation temperature or PFAS presence. Distinguish what the user confirmed, what the assistant estimated and what is unknown. Any health-related diet restrictions or clinical advice require validation with the treating clinician. Trial only; no real health photos.

## Requirement 10 — Food image recognition, nutrition estimates, follow-ups and health context
- A new R4.3 food AI extension appends an opt-in Food-101 ONNX image-classification feature, using Transformers.js v3.8.1 and the onnx-community/swin-finetuned-food101-ONNX model. Both JavaScript runtime and model weights download from third parties before local classification. External code has not been security-audited or self-hosted, and browser resource limits or CORS could prevent operation.
- Classification provides possible food classes and model scores, not accurate nutritional composition or verified probabilities. Food-101 does not cover all dishes, including char kway teow. The user must confirm the dish manually.
- The calories and macros calculator requires a measured portion in grams and per-100g nutrition values from a user-identified reference. It does NOT derive calories from the image. A displayed ±20% range is merely illustrative, not validated.
- Deterministic follow-up questions help fill missing details: portion, oil, sauce, cooking method, side dishes and drinks. This is not an autonomous conversational language model.
- The context tool reads the trial user profile, health flags and count of trial medical reports; it does not interpret lab findings or modify clinical diet prescriptions.
- A complete clinically reviewed AI health engine, accurate recipe recognition, photo-based portion quantification, medical interpretation and secure production login remain unimplemented.
- Trial only. Do not upload real food photos containing private information or real medical data. Live R4.2 is preserved, and R4.3 remains pending browser/security testing.

## Requirement 11 — Guided navigation and coherent UX
- New `r43_navigation.js` provides sidebar group headings and journey-focused ordering without removing or renaming existing routes. Grouping: Start Here, Wellness Plan, Daily Tracking, Health & Evidence, Tools & Settings.
- `#journey` provides an onboarding pathway: profiles → basic health context → wellness goals → any food or meal → exercise → trends. Medical records remain optional for non-clinical wellness guidance; no automatic interpretation or clearance.
- Food Studio now accepts **any user-entered dish name**, not a fixed example menu, and derives only cautious suggestions from confirmed user ingredients and optional category. Optional Food-101 classifier predictions may populate an editable text field; confirm before use. Historical saved meals remain readable without migration.
- Developer-only branch and synthetic data restrictions remain. Existing R4.2 baseline unchanged. UI requires browser verification and automated checks before production use.

## R4.3 Week planner — cultural meal choices and transparent body estimates
- `r43_cultural_planner.js` adds a 7-day educational example with recipes and example portions for French, Indian, Chinese and Malaysian food preferences, alongside week-long activity options and consistent meal/sleep timing.
- Intake captures sex for the Mifflin–St Jeor resting energy equation, optional target weight, time-to-goal and cultural food preference. BMI is a screening indicator only. Estimated daily use employs activity multipliers; it is not measured expenditure or an independently safe calorie prescription.
- All displayed sample recipe calories and protein values are placeholders/illustrative: they are NOT obtained from validated nutritional records. Do not prescribe or clinically apply this sample menu. The sample totals are not automatically scaled to the user's estimated energy needs. Personal allergies, dietary restrictions, medication and medical risks require further review.
- No historical childhood food habits are inferred from ancestry or nationality. The person must provide childhood region, cultural preferences and present location for genuine tailoring. Healthy-ageing comparisons use population guidance; no verified 130-year-old exists. Oldest fully authenticated person lived 122 years, 164 days.
- The renderer uses icons as illustrative food art, NOT photographs. Real images require properly licensed assets and verified associations.
- Code has synthetic scenario smoke tests, but full browser end-to-end validation and clinical review are pending. R4.2 remains unchanged.

## R4.3: 365-day 4-meal annual plan
- `r43_annual_planner.js` extends the seven-day planner to 365 deterministic **distinct day-level menu combinations** for French, Indian, Chinese, Malaysian and mixed pilot menus. Each day contains precisely four core eating occasions: breakfast (07:30), lunch (12:30), afternoon snack (15:30), and dinner (18:30). The plans use EXISTING illustrative recipes rotated across days and seasonal fruit/vegetable/drink ideas; **365 unique day combinations does NOT mean 1,460 unique verified dishes**.
- A day picker, previous/next controls and collapsible year overview make the calendar usable without expanding 1,460 meal cards. The generator depends on the Personal Guide profile and inherits vegan/vegetarian template choices.
- Optional smoothies, sweets, tea, coffee, supper, late-night snacks, beverages and alcohol are guidance topics, not mandatory eating occasions. Alcohol is not recommended for wellbeing and must not be treated as beneficial.
- **Nutrition:** All recipe kcal/protein data and the extra fruit energy figures are DEMO PLACEHOLDERS, not validated nutrient database measurements; the displayed daily sum explicitly excludes cooking fats/condiments/vegetable sides/extras where not captured. Do not interpret generated energy totals as prescribed calories. Food allergies and clinical restrictions are not comprehensively implemented.
- **Coverage:** full all-country recipes, genuine food photographs, automated seasonal availability, micronutrients, professionally calibrated meal planning and clinical integration remain pending. Real data MUST NOT be entered in this experimental app. Live R4.2 remains unchanged.

## R4.3 Universal food selection and ingredient nutrition worksheet
- "Universal / Worldwide Foods" is now an explicit cultural FOOD PREFERENCE option in the Personal Guide, separate from nationality. It combines the available French, Indian, Chinese and Malaysian pilot recipe templates in one annual menu; it does NOT cover all countries yet and never infers biological dietary traits.
- The 365-day view includes 4 core eating occasions, portions described in the recipe, and measured drink volume (e.g., 250 mL water, 200 mL tea or 150 mL coffee). These amounts are example quantities rather than verified exact personalised servings.
- Expand the "Ingredient quantities and nutrition calculations" accordion for any day to inspect parsed ingredient descriptions and edit measured weights. For each ingredient supply **kcal, protein, carbohydrate and fat per 100g**, together with a source/reference. Energy and macronutrients are calculated from weight(g) × reference amount(/100g) / 100. Unknown values are never silently assigned zero; a full daily calculation is withheld if required fields are missing.
- Ingredient parsing is incomplete: recipe descriptions with volumes, piece counts, composite dishes, cooked/raw weights, recipes, sauces or oil need human correction. Per-100g values are intentionally not auto-filled from unvalidated nutrition sources.
- The existing demo meal energy cards are **not verified** and must not be treated as precise dietary advice or medical energy targets. To deliver actual calculated plate nutrition for all users, integrate an independently verified composition database, recipe yields and cooked-portion calibrations, ingredient allergies and exclusions, and a medical dietitian-reviewed safety process.
- Goal-related descriptions are educational, not clinical prescriptions or guarantees of effects on individual body parts; R4.2 remains unchanged.

## R4.3 opt-in source-linked packaged food lookup
- `r43_food_reference.js` provides **user-clicked only** search (product name, legacy Open Food Facts CGI search API, or barcode via Open Food Facts v2 product read API). It returns a maximum of 8 products with per-100g energy; no automatic search-as-you-type. API service permits rate-limited use; this trial also applies a client-side delay. Browser CORS, third-party service changes or rate limits can prevent lookup.
- The app sends only the entered food search string or barcode, NOT profile, medical details or a patient document. User must compare the returned branded product to the actual packaging and explicitly confirm before nutrient values are copied into the ingredient worksheet.
- Nutrition fields that do not exist in the external response remain **blank**. Per-100 g energy, protein, carbohydrate and fat values are calculated from user-confirmed ingredient quantity. A source label (Open Food Facts + product barcode) is retained in the input field. Community-sourced records are NOT independently verified; branded product records are not necessarily suitable for unpackaged foods or cooked recipes.
- Data attribution: Open Food Facts (openfoodfacts.org), Open Database License (ODbL); check attribution, share-alike and redistribution obligations before deployment. This local development demonstration has not undergone a license compliance or security audit.
- The Australian Food Composition Database (AFCD) provides higher-quality Australian data and recipe methods (FSANZ). Integration/import and food-catalogue matching remain future work; no false assertion that all SEMITS recipe estimates are now verified.
- This step does NOT generate a clinical food prescription, authenticate image recognition, retrieve every ingredient type or make real patient records safe to store. R4.2 remains unchanged.

## R4.3 Cooking yield and plated-serving calculator
- New `r43_cooking_engine.js` is connected inside each 365-day meal's ingredient nutrition worksheet. It takes explicit measured ingredient weights and per-100g reference kcal and macronutrients, a user-measured amount of added oil (including 0 when none), sourced oil nutrition when oil >0, final cooked batch weight and actual plated serving weight.
- Batch energy = sum(ingredient grams × sourced kcal per 100 g / 100) + explicitly supplied oil energy. Per-100g cooked energy = batch kcal / measured cooked yield ×100. Plate energy = batch kcal × plated grams / cooked batch grams. Protein/carbohydrate/fat are calculated when ALL relevant reference macro values are present.
- This is a **conditional arithmetic model**, NOT a validated cooked-food database. Cooking yield (water mass change) is NOT assumed to destroy calories. No unknown nutrient-retention factors are applied. Drained oils, sauces, stock, removed bones, and other discarded solids must be subtracted based on measured edible intake before calculations. Oil absorption is never inferred from cooking method. A plate may not have a uniform composition across the batch; actual nutrition may differ.
- Incomplete ingredients, missing source references, unknown oil and invalid serving weights block a complete plate result. This stage does not add automatic global food-data mapping, audited treatment recommendations or medical nutrition prescription. Use fictional records only; stable R4.2 untouched.

## R4.3 nutrition retention and diet review safeguards (next stage)
- `r43_retention_engine.js`: Optional **explicit, sourced** retention-factor calculator. Accepts a nutrient name, raw nutrient amount with unchanged unit, 0–100% factor, food group, cooking method and exact source/table reference. Computes raw × factor / 100 with transparent assumptions; **no USDA coefficient is preloaded or applied by default**. Genuine nutrient-by-method matching from USDA Release 6 remains unimplemented until verified lookup/licensing/import and scope alignment are complete.
- `r43_diet_review.js`: A non-clinical review gate identifies missing profile data, minor status, emergency signs, selected medical flags, allergy screening, medication review, unsourced ingredients, unmeasured yields and missing nutrient references. It always returns `NOT CLINICALLY VALIDATED`. Checklist flags are NOT a clinical safety clearance or clinician signoff.
- `r43_nutrition_detail.js` now exposes both components under the per-meal worksheet in the existing 365-day calendar. No patient records are transmitted to the retention tool.
- Authoritative sources for future reference integration: FSANZ Australian Food Composition Database, USDA FoodData Central and USDA Nutrient Retention Factors Release 6. Fully automatic all-country ingredient mapping, nutrient-factor selection and independent clinical efficacy/safety validation are **not complete**. Avoid claims of verified output for synthetic sample recipes.
- Stable R4.2 untouched; R4.3 requires browser and full smoke/CI testing before promotion.
