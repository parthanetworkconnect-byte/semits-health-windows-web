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
