# PRD: App styling alignen met Landing Page

## Doel
De app UI moet visueel aansluiten bij de landing page (eatslowcarb.com/?landing=1). Zelfde premium gevoel, zelfde design language.

## Referentie
- Landing page: `src/components/LandingPageFinal.tsx`
- Live: https://eatslowcarb.com/?landing=1

## Wat WEL aanpassen (CSS/Tailwind only)

### 1. Typography
- Headings in de app → `font-display` (Fraunces), net als landing page
- Body text → Satoshi (staat al, maar check consistency)
- Grotere font-sizes voor section headers (text-2xl → text-3xl waar nodig)

### 2. Whitespace & Spacing
- Meer padding in cards en secties (p-4 → p-6, p-8 waar het past)
- Meer ruimte tussen secties (py-4 → py-6/py-8)
- Cards: rounded-2xl ipv rounded-xl

### 3. Kleurpalet
Landing page gebruikt:
- `sage-600` / `sage-700` voor primary (groen)
- `stone-50` / `stone-100` voor achtergronden
- `stone-600` / `stone-800` voor tekst
- `clay-500` / `clay-600` voor accenten (warm oranje/bruin)
- `cream` als page background

App moet dezelfde tokens gebruiken. Check of er afwijkende kleuren zijn (hardcoded hex, andere tailwind tokens).

### 4. Card styling
Landing page cards:
- `rounded-2xl border border-stone-100 bg-white shadow-soft`
- Subtiele borders, geen harde lijnen
- Hover: zachte shadow transitie

### 5. Buttons
Landing page:
- Primary: `bg-sage-600 text-white rounded-xl hover:bg-sage-700`
- Secondary: `bg-white text-sage-700 border border-stone-200 rounded-xl`

## Prioriteit (hoogste eerst)
1. **Dashboard** — eerste scherm dat gebruikers zien
2. **Recepten overzicht** — meest gebruikte tab
3. **Recept detail / modals** — waar je het langst naar kijkt
4. **Leren tab** — content pagina
5. **Boodschappen tab** — minst kritisch
6. **Bottom nav** — subtiel maar belangrijk

## Wat NIET aanpassen
- Geen componenten herstructureren
- Geen nieuwe dependencies
- Geen backend/logic changes
- Geen layout changes (grid/flex structuur blijft)
- Bottom nav positie/structuur blijft

## Test
Na elke wijziging: vergelijk visueel met de landing page. Moet als één geheel aanvoelen.
