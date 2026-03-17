# Recept SEO-selectie: Welke 15 recepten eerst publiek?

> **Doel:** Selectie van recepten die het meeste SEO-verkeer opleveren
> **Logica:** Combinatie van zoekpotentie (keyword volume + concurrentie), breedte (ontbijt/lunch/diner), en slow-carb-uniciteit
> **Datum:** 17 maart 2026

---

## Selectiecriteria

1. **Zoekpotentie** — wordt er op gezocht? (in NL of EN-spillover)
2. **Slow-carb-uniciteit** — onderscheidend t.o.v. generic keto/low carb recepten
3. **Recipe schema impact** — recepten met prep time, ingrediënten en stappen krijgen rich snippets
4. **Categoriespreiding** — ontbijt, lunch, avondeten, airfryer, meal prep
5. **CTA-natuurlijkheid** — leidt het recept logisch naar "meer recepten in de app"?

---

## Top 15 Recepten om Publiek te Maken

### Tier 1: Hoogste zoekpotentie (eerste 5 — deploy in week 3)

| # | Recept | Categorie | Target Keyword | Waarom eerst |
|---|--------|-----------|----------------|-------------|
| 1 | **Slow Carb Chili Con Carne** | Avondeten | "slow carb chili con carne", "chili con carne zonder rijst" | DÉ signature slow carb maaltijd. Wordt internationaal veel gezocht. Geen NL slow carb versie bestaat |
| 2 | **Scrambled Eggs met Zwarte Bonen en Spinazie** | Ontbijt | "ontbijt zonder brood afvallen", "eiwit ontbijt recept" | Hoog zoekvolume op "ontbijt zonder brood". Perfecte intro tot slow carb |
| 3 | **Slow Carb Linzensoep** | Lunch / Meal Prep | "linzensoep recept", "linzensoep afvallen" | "Linzensoep" is een van de meest gezochte recepten in NL. Onze versie is slow-carb-compliant |
| 4 | **Kip met Zwarte Bonen en Broccoli** | Avondeten | "kip zwarte bonen recept", "koolhydraatarm avondeten" | "Koolhydraatarm avondeten" = hoog volume. Simpel, herkenbaar recept |
| 5 | **De Ferriss Klassieker** | Ontbijt | "tim ferriss ontbijt", "slow carb ontbijt" | Signature recept uit The 4-Hour Body. Naam trekt Tim Ferriss-zoekers |

### Tier 2: Sterk zoekpotentie + niche (volgende 5 — deploy in week 4)

| # | Recept | Categorie | Target Keyword | Waarom |
|---|--------|-----------|----------------|--------|
| 6 | **Airfryer Kip met Groenten** | Avondeten / Airfryer | "airfryer kip recept", "airfryer afvallen" | "Airfryer recept" is explosief in NL. Jullie hebben een airfryer-filter — benut dat |
| 7 | **Mexicaanse Bonenschotel** | Avondeten | "mexicaanse bonenschotel", "slow carb mexicaans" | Herkenbaar comfort food, makkelijk te vinden via "bonenschotel" |
| 8 | **Tofu Scramble** | Ontbijt | "tofu scramble recept", "vegan ontbijt eiwit" | Vangt vegetarische/vegan zoekers op. Zit al in de app |
| 9 | **Meal Prep Kip-Linzen Bowl** | Meal Prep | "meal prep afvallen", "meal prep recept simpel" | "Meal prep" is groeiend zoekvolume. Past bij de doelgroep (drukke mensen) |
| 10 | **Roerbak met Garnalen en Snijbonen** | Avondeten / No-Time | "garnalen roerbak recept", "snel avondeten afvallen" | Snelheid + eiwit. "Snel avondeten" is een veelgezocht cluster |

### Tier 3: Long-tail + categoriedekking (laatste 5 — deploy in week 5-6)

| # | Recept | Categorie | Target Keyword | Waarom |
|---|--------|-----------|----------------|--------|
| 11 | **Hüttenkäse met...** | Ontbijt / No-Time | "hüttenkäse recept afvallen", "kwark ontbijt koolhydraatarm" | Zit al in app. Makkelijk, 2 min. Vangt "snel ontbijt" zoekers |
| 12 | **Slow Carb Omelet met Champignons** | Ontbijt | "omelet recept afvallen", "eieren ontbijt recept" | Eieren-recepten zijn altijd populair. Basis maar nodig voor dekking |
| 13 | **Kikkererwten Curry zonder Rijst** | Avondeten | "kikkererwten curry recept", "curry zonder rijst" | Vangt "curry recept" verkeer op + "zonder rijst" is slow-carb-niche |
| 14 | **Tonijnsalade met Witte Bonen** | Lunch | "tonijnsalade recept", "lunch zonder brood afvallen" | "Lunch zonder brood" is een groeiend keyword. Makkelijk recept |
| 15 | **Zwarte Bonen Soep** | Lunch / Meal Prep | "zwarte bonen soep recept", "bonen soep afvallen" | Peulvruchten-basis = kern slow carb. Goed voor meal prep categorie |

---

## URL-structuur

```
/recepten/                          → overzichtspagina (alle publieke recepten)
/recepten/slow-carb-chili-con-carne → individueel recept
/recepten/scrambled-eggs-zwarte-bonen-spinazie
/recepten/slow-carb-linzensoep
/recepten/kip-zwarte-bonen-broccoli
/recepten/de-ferriss-klassieker
...etc
```

## Per Receptpagina: Verplichte Elementen

1. **H1:** Receptnaam
2. **Meta title:** `{{Receptnaam}} — Slow Carb Recept | SlowCarb`
3. **Meta description:** `{{Korte beschrijving}}. Klaar in {{X}} minuten. Voldoet aan alle 5 slow carb regels.`
4. **Recipe schema JSON-LD** (template staat in seo-schema-templates.md)
5. **Zichtbaar op pagina:**
   - Foto
   - Prep time + cook time
   - Porties
   - Eiwitgehalte
   - Ingrediëntenlijst
   - Stap-voor-stap bereiding
   - "Voldoet aan alle 5 slow carb regels" badge
   - Tags (Ontbijt/Lunch/Avondeten, Airfryer, Meal Prep, No-Time)
6. **Interne links:**
   - "Meer slow carb recepten →" (naar /recepten/)
   - 2-3 gerelateerde recepten onderaan
   - Link naar pillar page ("Wat is het slow carb dieet?")
   - CTA: "Alle 50+ recepten + boodschappenlijst → €47"
7. **Breadcrumb:** Home > Recepten > {{Receptnaam}}

## Wat NIET publiek maken

- Recepten die te simpel zijn voor een eigen pagina (bijv. "gekookt ei met zout")
- Recepten zonder foto (Google beloont Recipe schema met afbeelding)
- Recepten die te dicht bij bestaande online recepten liggen zonder slow-carb-toevoeging

## Verwacht resultaat

15 receptpagina's = 15 nieuwe Google-ingangen. Met Recipe schema krijgen ze rich snippets (foto + bereidingstijd + sterren). Elke pagina linkt naar de app voor "meer recepten" — dat is de conversie-funnel.

Geschatte tijd tot eerste indexatie: 2-4 weken na deploy + sitemap submission.
