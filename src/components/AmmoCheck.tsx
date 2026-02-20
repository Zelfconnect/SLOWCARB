import { AlertTriangle, CheckCircle2, ChefHat, Package, Refrigerator, Snowflake, Target, type LucideIcon } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

interface AmmoZone {
  id: string;
  name: string;
  icon: string;
  items: AmmoItem[];
}

interface AmmoItem {
  id: string;
  name: string;
  checked: boolean;
}

const DEFAULT_ZONES: AmmoZone[] = [
  {
    id: 'vriezer',
    name: 'De Vriezer',
    icon: 'snowflake',
    items: [
      { id: 'kip', name: '2kg kipfilet (of 1 grote zak diepvries)', checked: false },
      { id: 'broccoli', name: '4 zakken diepvries broccoli (1kg)', checked: false },
      { id: 'spinazie-vries', name: '2 zakken diepvries spinazie', checked: false },
      { id: 'edamame', name: '1 zak edamame/sojabonen (optioneel)', checked: false },
    ],
  },
  {
    id: 'voorraadkast',
    name: 'De Voorraadkast',
    icon: 'package',
    items: [
      { id: 'bonen', name: '12 blikken zwarte bonen (minimum)', checked: false },
      { id: 'tonijn', name: '6 blikken tonijn (emergency dagen)', checked: false },
      { id: 'tomaten', name: '6 blikken tomatenblokjes', checked: false },
      { id: 'olie', name: 'Grote pot kokosolie of olijfolie', checked: false },
      { id: 'kruiden', name: 'Peper, zout, komijn, chili flakes', checked: false },
      { id: 'azijn', name: 'Balsamico/azijn (optioneel)', checked: false },
    ],
  },
  {
    id: 'koelkast',
    name: 'De Koelkast',
    icon: 'refrigerator',
    items: [
      { id: 'eieren', name: '2 dozijn eieren (24 stuks)', checked: false },
      { id: 'spinazie-vers', name: '1 zak verse spinazie (zondag recovery)', checked: false },
      { id: 'sambal', name: 'Sambal & knoflook', checked: false },
    ],
  },
  {
    id: 'tools',
    name: 'Airfryer Station',
    icon: 'chefhat',
    items: [
      { id: 'bakpapier', name: 'Bakpapier (voor airfryer mandje)', checked: false },
      { id: 'oliespray', name: 'Olie spray fles (geen spuitbus)', checked: false },
      { id: 'mengkom', name: 'Grote mengkom (marineren)', checked: false },
      { id: 'bakjes', name: '5 vershoudbakjes (mealprep)', checked: false },
    ],
  },
];

const zoneIconMap: Record<string, { Icon: LucideIcon; label: string }> = {
  snowflake: { Icon: Snowflake, label: 'Vriezer' },
  package: { Icon: Package, label: 'Voorraadkast' },
  refrigerator: { Icon: Refrigerator, label: 'Koelkast' },
  chefhat: { Icon: ChefHat, label: 'Airfryer' },
};

function getZoneIcon(value: string) {
  const normalized = value.replace(/[\s-]/g, '').toLowerCase();
  return zoneIconMap[value] || zoneIconMap[normalized] || zoneIconMap.package;
}

function isOptional(item: AmmoItem) {
  return item.name.toLowerCase().includes('optioneel');
}

function getZoneStatus(zone: AmmoZone): 'green' | 'red' {
  const requiredItems = zone.items.filter((item) => !isOptional(item));
  return requiredItems.every((item) => item.checked) ? 'green' : 'red';
}

function getAllZonesStatus(zones: AmmoZone[]): 'locked' | 'restock' {
  return zones.every((zone) => getZoneStatus(zone) === 'green') ? 'locked' : 'restock';
}

export function AmmoCheck() {
  const [zones, setZones] = useLocalStorage<AmmoZone[]>('slowcarb-ammo-v1', DEFAULT_ZONES);

  const toggleItem = (zoneId: string, itemId: string) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return {
          ...zone,
          items: zone.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const overallStatus = getAllZonesStatus(zones);

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-2xl bg-gradient-to-br from-sage-600 to-sage-700 p-5 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Target className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold leading-tight text-white">Ammo Check</h2>
            <p className="mt-1 text-base text-sage-100">Check je zones. Iets leeg? Restock.</p>
          </div>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {zones.map((zone) => {
          const status = getZoneStatus(zone);
          const zoneIcon = getZoneIcon((zone as { icon?: string; emoji?: string }).icon ?? (zone as { emoji?: string }).emoji ?? 'package');

          return (
            <AccordionItem
              key={zone.id}
              value={zone.id}
              className="card-website overflow-hidden"
            >
              <AccordionTrigger className="min-h-[74px] px-5 py-4 hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:box-content [&>svg]:p-2 [&>svg]:text-stone-500 [&>svg]:transition-transform [&>svg]:duration-200">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'h-3 w-3 rounded-full',
                      status === 'green' ? 'bg-sage-500' : 'bg-clay-400'
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
                    <zoneIcon.Icon
                      className="h-5 w-5 text-stone-600"
                      aria-label={zone.name}
                    />
                  </div>
                  <span className="font-display text-2xl font-semibold leading-tight text-stone-800">{zone.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="border-t border-stone-200 bg-white">
                  {zone.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(zone.id, item.id)}
                      className="flex min-h-12 w-full items-center gap-3 border-b border-stone-100 px-5 py-3 text-left transition-colors hover:bg-stone-50/70 last:border-b-0"
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(zone.id, item.id)}
                        className={cn(
                          'size-6 rounded-lg border-2',
                          item.checked
                            ? 'data-[state=checked]:bg-sage-500 data-[state=checked]:border-sage-500'
                            : 'border-stone-300 bg-white'
                        )}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={item.name}
                      />
                      <span
                        className={cn(
                          'text-base leading-relaxed font-medium',
                          item.checked ? 'text-sage-700' : 'text-stone-700'
                        )}
                      >
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {overallStatus === 'locked' ? (
        <Card className="border-sage-200 bg-gradient-to-br from-sage-50 to-sage-100/40 py-0 shadow-soft">
          <CardContent className="p-4">
            <p className="flex items-center gap-2 font-display font-semibold text-sage-800">
              <CheckCircle2 className="w-5 h-5" />
              Locked and loaded
            </p>
            <p className="mt-1 text-sm text-sage-700">
              Je bent klaar voor de komende 2 weken. Go prep.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-clay-200 bg-gradient-to-br from-clay-50 to-clay-100/40 py-0 shadow-soft">
          <CardContent className="p-4">
            <p className="flex items-center gap-2 font-display font-semibold text-clay-800">
              <AlertTriangle className="w-5 h-5" />
              Voorraad laag
            </p>
            <p className="mt-1 text-sm text-clay-700">Tijd voor een groothandel run.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
