import { useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Package,
  Refrigerator,
  Snowflake,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

const STORAGE_KEY_V2 = 'slowcarb-ammo-v2';
const STORAGE_KEY_V1 = 'slowcarb-ammo-v1';

export interface AmmoItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface AmmoSection {
  id: string;
  name: string;
  description: string;
  items: AmmoItem[];
}

export interface AmmoZone {
  id: string;
  name: string;
  icon: string;
  description: string;
  sections: AmmoSection[];
}

interface LegacyAmmoItem {
  id: string;
  name: string;
  checked: boolean;
}

interface LegacyAmmoZone {
  id: string;
  name: string;
  icon?: string;
  items: LegacyAmmoItem[];
}

interface AmmoItemTemplate {
  id: string;
  name: string;
}

interface AmmoSectionTemplate {
  id: string;
  name: string;
  description: string;
  items: AmmoItemTemplate[];
}

interface AmmoZoneTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  sections: AmmoSectionTemplate[];
}

const ZONE_TEMPLATES: AmmoZoneTemplate[] = [
  {
    id: 'vriezer',
    name: 'ZONE 1: De Vriezer',
    icon: 'snowflake',
    description: 'Koop in grootverpakkingen. Zonder deze basis val je stil.',
    sections: [
      {
        id: 'bulk-eiwit-noodgroenten',
        name: 'Bulk Eiwit & Noodgroenten',
        description: 'Je primaire voorraad voor spieropbouw en noodscenario\'s.',
        items: [
          { id: 'bulk-rundergehakt', name: 'Bulk rundergehakt: mager of half-om-half voor chili en snelle bowls.' },
          { id: 'bulk-kippendijen', name: 'Bulk kippendijen: blijft mals en levert calorieen voor spiergroei.' },
          { id: 'diepvriesgroenten', name: 'Diepvriesgroenten (spinazie & broccoli): direct inzetbaar als de vers-lade leeg is.' },
        ],
      },
    ],
  },
  {
    id: 'koelkast',
    name: 'ZONE 2: De Koelkast',
    icon: 'refrigerator',
    description: 'De motor voor je dagelijkse eiwitdoel en maagvulling.',
    sections: [
      {
        id: 'eiwit-motor',
        name: 'De Eiwit-Motor',
        description: 'Houd deze basis vol om dagelijks je eiwitdoel te raken.',
        items: [
          { id: 'eieren', name: 'Eieren (trays van 30+): fundament voor dagelijks gebruik.' },
          { id: 'huttenkase', name: 'Huttenkase (400g): trage caseine voor de nacht (optioneel bij stagnatie).' },
          { id: 'koude-vleeswaren', name: 'Koude vleeswaren (200g+): gerookte kip of kalkoen voor directe honger.' },
          { id: 'bakvet', name: 'Bakvet: grasgevoerde roomboter of ghee op voorraad.' },
        ],
      },
      {
        id: 'vers-lade',
        name: 'De Vers-Lade',
        description: 'Onbeperkt volume en textuur. Hoe voller deze lade, hoe makkelijker het dieet.',
        items: [
          { id: 'paprikas', name: 'Paprika\'s: snelle crunch voor elke maaltijd.' },
          { id: 'champignons', name: 'Champignons (400g+): absorbeert braadvet en geeft extra volume.' },
          { id: 'verse-broccoli-bloemkool', name: 'Verse broccoli/bloemkool: snel stomen of roosteren.' },
          { id: 'courgette', name: 'Courgette: ideaal voor wokken of courgetti.' },
          { id: 'spinazie-vers', name: 'Verse spinazie: essentieel voor snelle ochtend-eieren.' },
          { id: 'zuurkool-kimchi', name: 'Zuurkool of kimchi: vult, blijft lang goed en ondersteunt darmflora.' },
        ],
      },
    ],
  },
  {
    id: 'voorraadkast',
    name: 'ZONE 3: De Voorraadkast',
    icon: 'package',
    description: 'Dit bederft niet. Sla in per tray voor constante brandstof.',
    sections: [
      {
        id: 'brandstof-snel-eiwit',
        name: 'Brandstof & Snel Eiwit',
        description: 'De stabiele basis voor training en snelle maaltijden.',
        items: [
          { id: 'peulvruchten-trays', name: 'Peulvruchten (trays): linzen, zwarte bonen, pinto of cannellini.' },
          { id: 'tonijn', name: 'Tonijn op water: snelle eiwit-lunch zonder koken.' },
          { id: 'uien', name: 'Uien & verse knoflook: de smaakbasis voor gehakt en chili.' },
          { id: 'eiwitpoeder', name: 'Eiwitpoeder (wei-isolaat): noodoplossing met water bij tijdsnood.' },
        ],
      },
    ],
  },
  {
    id: 'smaakmakers',
    name: 'ZONE 4: Smaakmakers',
    icon: 'chefhat',
    description: 'Houd repetitief eten vol zonder de regels te breken (0% suiker).',
    sections: [
      {
        id: 'arsenaal',
        name: 'Het Arsenaal',
        description: 'Smaakvariatie zodat meal prep vol te houden blijft.',
        items: [
          { id: 'olien', name: 'Olien: olijfolie voor dressings en avocado/macadamia voor hoge hitte.' },
          { id: 'punch', name: 'De punch: Zaanse of Dijon mosterd (zonder honing), plus sojasaus/tamari.' },
          { id: 'hitte', name: 'Hitte: tabasco, pure sambal of suikervrije sriracha.' },
          { id: 'droge-kruiden', name: 'Droge kruiden (bulk): knoflookpoeder, uienpoeder, gerookte paprika en komijn.' },
        ],
      },
    ],
  },
];

const zoneIconMap: Record<string, { Icon: LucideIcon; label: string }> = {
  snowflake: { Icon: Snowflake, label: 'Vriezer' },
  package: { Icon: Package, label: 'Voorraadkast' },
  refrigerator: { Icon: Refrigerator, label: 'Koelkast' },
  chefhat: { Icon: ChefHat, label: 'Smaakmakers' },
};

function getZoneIcon(value: string) {
  const normalized = value.replace(/[\s-]/g, '').toLowerCase();
  return zoneIconMap[value] || zoneIconMap[normalized] || zoneIconMap.package;
}

function getZoneDisplayParts(zoneName: string) {
  const [zoneLabel, ...titleParts] = zoneName.split(':');
  const zoneTitle = titleParts.join(':').trim();
  return {
    zoneLabel: zoneLabel.trim(),
    zoneTitle: zoneTitle.length > 0 ? zoneTitle : zoneName,
  };
}

function getZoneProgress(zone: AmmoZone) {
  const allItems = zone.sections.flatMap((section) => section.items);
  const checkedItemsCount = allItems.filter((item) => item.checked).length;
  return { checkedItemsCount, totalItemsCount: allItems.length };
}

function isOptional(item: AmmoItem) {
  return item.name.toLowerCase().includes('(optioneel)');
}

function createCheckedMapFromLegacy(zones: LegacyAmmoZone[]): Record<string, boolean> {
  return zones.reduce<Record<string, boolean>>((acc, zone) => {
    for (const item of zone.items) {
      acc[item.id] = item.checked;
    }
    return acc;
  }, {});
}

function hasLegacyShape(value: unknown): value is LegacyAmmoZone[] {
  if (!Array.isArray(value)) return false;
  return value.every((zone) => {
    if (!zone || typeof zone !== 'object') return false;
    const maybeZone = zone as Partial<LegacyAmmoZone>;
    return typeof maybeZone.id === 'string' && Array.isArray(maybeZone.items);
  });
}

export function createDefaultZones(checkedById: Record<string, boolean> = {}): AmmoZone[] {
  return ZONE_TEMPLATES.map((zone) => ({
    id: zone.id,
    name: zone.name,
    icon: zone.icon,
    description: zone.description,
    sections: zone.sections.map((section) => ({
      id: section.id,
      name: section.name,
      description: section.description,
      items: section.items.map((item) => ({
        id: item.id,
        name: item.name,
        checked: checkedById[item.id] ?? false,
      })),
    })),
  }));
}

export function migrateLegacyAmmoZones(legacyZones: LegacyAmmoZone[]): AmmoZone[] {
  return createDefaultZones(createCheckedMapFromLegacy(legacyZones));
}

export function getZoneStatus(zone: AmmoZone): 'green' | 'red' {
  const requiredItems = zone.sections
    .flatMap((section) => section.items)
    .filter((item) => !isOptional(item));
  return requiredItems.every((item) => item.checked) ? 'green' : 'red';
}

export function getAllZonesStatus(zones: AmmoZone[]): 'locked' | 'restock' {
  return zones.every((zone) => getZoneStatus(zone) === 'green') ? 'locked' : 'restock';
}

export function AmmoCheck() {
  const defaultZones = useMemo(() => createDefaultZones(), []);
  const [zones, setZones] = useLocalStorage<AmmoZone[]>(STORAGE_KEY_V2, defaultZones);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasV2Data = window.localStorage.getItem(STORAGE_KEY_V2);
    if (hasV2Data) return;

    const legacyRaw = window.localStorage.getItem(STORAGE_KEY_V1);
    if (!legacyRaw) return;

    try {
      const parsedLegacy = JSON.parse(legacyRaw) as unknown;
      if (!hasLegacyShape(parsedLegacy)) return;
      setZones(migrateLegacyAmmoZones(parsedLegacy));
    } catch {
      return;
    }
  }, [setZones]);

  const toggleItem = (zoneId: string, sectionId: string, itemId: string) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return {
          ...zone,
          sections: zone.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            };
          }),
        };
      })
    );
  };

  const overallStatus = getAllZonesStatus(zones);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-sage-600 to-sage-700 p-6 text-white shadow-surface">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Target className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold leading-tight text-white">Ammo Check</h2>
            <p className="mt-1 text-sm text-sage-100">Geen keuzestress. Alleen brandstof en afvinken.</p>
          </div>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {zones.map((zone) => {
          const status = getZoneStatus(zone);
          const zoneIcon = getZoneIcon(zone.icon);
          const { zoneLabel, zoneTitle } = getZoneDisplayParts(zone.name);
          const { checkedItemsCount, totalItemsCount } = getZoneProgress(zone);

          return (
            <AccordionItem key={zone.id} value={zone.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-surface">
              <AccordionTrigger
                aria-label={zone.name}
                className="min-h-[74px] px-5 py-4 hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:box-content [&>svg]:p-2 [&>svg]:text-stone-500 [&>svg]:transition-transform [&>svg]:duration-200"
              >
                <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-3 pr-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sage-500 to-sage-600 shadow-soft">
                    <zoneIcon.Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-stone-500">{zoneLabel}</p>
                    <p className="truncate font-display text-lg font-semibold leading-tight text-stone-800">{zoneTitle}</p>
                    <p className="mt-0.5 text-sm font-medium tabular-nums text-stone-600">{checkedItemsCount}/{totalItemsCount}</p>
                  </div>
                  {status === 'green' ? (
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 text-white"
                      aria-label={`${zoneTitle} compleet`}
                    >
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="h-8 w-8" aria-hidden="true" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="border-t border-stone-200 bg-white">
                  <div className="border-b border-stone-100 px-5 py-3">
                    <p className="text-sm text-stone-600">{zone.description}</p>
                  </div>
                  {zone.sections.map((section) => (
                    <div key={section.id} className="border-b border-stone-100 last:border-b-0">
                      <div className="bg-stone-50/80 px-5 py-3">
                        <p className="font-display text-base font-semibold text-stone-800">{section.name}</p>
                        <p className="mt-1 text-sm text-stone-600">{section.description}</p>
                      </div>
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleItem(zone.id, section.id, item.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              toggleItem(zone.id, section.id, item.id);
                            }
                          }}
                          className="flex min-h-12 w-full items-center gap-3 border-t border-stone-100 px-5 py-3 text-left transition-colors hover:bg-stone-50/70"
                        >
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(zone.id, section.id, item.id)}
                            className={cn(
                              'size-6 rounded-lg border-2',
                              item.checked
                                ? 'data-[state=checked]:border-sage-500 data-[state=checked]:bg-sage-500'
                                : 'border-stone-300 bg-white'
                            )}
                            onClick={(event) => event.stopPropagation()}
                            aria-label={item.name}
                          />
                          <span
                            className={cn(
                              'text-sm font-medium leading-relaxed',
                              item.checked ? 'text-sage-700' : 'text-stone-700'
                            )}
                          >
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {overallStatus === 'locked' ? (
        <div className="rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 to-sage-100/40 p-5 shadow-surface">
          <p className="flex items-center gap-2 font-display font-semibold text-sage-800">
            <CheckCircle2 className="h-5 w-5" />
            Locked and loaded
          </p>
          <p className="mt-1 text-sm text-sage-700">Je basis staat op groen. Tijd om te preppen en doorknallen.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100/40 p-5 shadow-surface">
          <p className="flex items-center gap-2 font-display font-semibold text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Voorraad niet compleet
          </p>
          <p className="mt-1 text-sm text-red-700">Alles op rood is je directe inkooplijst voor de supermarkt.</p>
        </div>
      )}
    </div>
  );
}
