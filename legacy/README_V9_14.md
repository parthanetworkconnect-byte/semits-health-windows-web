# SEMITS Health V9.14 — Source-linked food record repair

This update preserves the 561-entry catalogue and the medical, family, workouts and planner modules.

## What changed
- Red cabbage now has a source-linked **raw** nutrient profile (USDA SR Legacy FDC 169977). Values: kcal 31, protein 1.43 g, carbohydrates 7.37 g, fat 0.16 g, fibre 2.1 g per 100 g.
- Botanical and historical notes for Brassica oleracea link to Oxford Plants 400 and an open-access evolutionary-history paper.
- Source links and source preparation are displayed on the detail panel for source-linked entries.
- Other food records remain *pending* if a precise nutrient ID is not available. Do not interpret that as zero nutrients.

## Why most entries are still not filled
561 names were seeded without matching 561 actual database food identifiers. External database download is not available in this build environment. It is unsafe to copy values between raw/cooked foods or between species. Country of origin, organic/GM status, digestion time, allergy status and suitability for animals are separate kinds of claims requiring different evidence.

## Launch
Start using `START_WINDOWS.bat`, keep server console open, open http://127.0.0.1:8773 then Ctrl+F5. Export backup of existing data first.

## Reference URLs
USDA: https://fdc.nal.usda.gov/food-details/169977/nutrients
Oxford: https://herbaria.plants.ox.ac.uk/bol/plants400/profiles/AB/Brassicaoleracea
Open access research: https://pmc.ncbi.nlm.nih.gov/articles/PMC8476135/

This is a development prototype, not a clinical reference tool.
