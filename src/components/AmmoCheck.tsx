import { useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, ChefHat, ChevronDown, Package, Refrigerator, Snowflake, Target, type LucideIcon } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

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
  const [openZones, setOpenZones] = useState<string[]>([]);

  const toggleZone = (zoneId: string) => {
    setOpenZones((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
    );
  };

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
    <div className="space-y-4 pb-24">
      <div className="rounded-2xl p-5 bg-gradient-to-br from-sage-50 to-sage-100/60 border border-sage-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sage-200 flex items-center justify-center">
            <Target className="w-6 h-6 text-sage-800" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-sage-900">Ammo Check</h2>
            <p className="text-sm text-sage-700">Check je zones. Iets leeg? Restock.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => {
          const status = getZoneStatus(zone);
          const isOpen = openZones.includes(zone.id);
          const panelId = `ammo-panel-${zone.id}`;
          const zoneIcon = getZoneIcon((zone as { icon?: string; emoji?: string }).icon ?? (zone as { emoji?: string }).emoji ?? 'package');

          return (
            <div key={zone.id} className="card-premium overflow-hidden">
              <button
                type="button"
                onClick={() => toggleZone(zone.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between px-4 min-h-12 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-3 h-3 rounded-full',
                      status === 'green' ? 'bg-emerald-500' : 'bg-rose-500'
                    )}
                    aria-hidden="true"
                  />
                  <zoneIcon.Icon
                    className="w-6 h-6 text-stone-600"
                    aria-label={zone.name}
                  />
                  <span className="font-display font-medium text-stone-800">{zone.name}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-stone-500 transition-transform',
                    isOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div id={panelId} className="border-t border-stone-100">
                  {zone.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(zone.id, item.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 min-h-11 text-left hover:bg-stone-50 transition-colors"
                    >
                      <span className="min-w-11 min-h-11 -ml-2 flex items-center justify-center flex-shrink-0">
                        <span
                          className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center',
                            item.checked
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-stone-300'
                          )}
                        >
                          {item.checked && <Check className="w-4 h-4 text-white" />}
                        </span>
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          item.checked ? 'text-emerald-700' : 'text-stone-700'
                        )}
                      >
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {overallStatus === 'locked' ? (
        <div className="card-premium p-4 bg-emerald-50 border border-emerald-100">
          <p className="font-display font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Locked and loaded
          </p>
          <p className="text-sm text-emerald-700 mt-1">
            Je bent klaar voor de komende 2 weken. Go prep.
          </p>
        </div>
      ) : (
        <div className="card-premium p-4 bg-rose-50 border border-rose-100">
          <p className="font-display font-semibold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Voorraad laag
          </p>
          <p className="text-sm text-rose-700 mt-1">Tijd voor een groothandel run.</p>
        </div>
      )}
    </div>
  );
}
