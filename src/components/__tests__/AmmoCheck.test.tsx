import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AmmoCheck,
  createDefaultZones,
  getAllZonesStatus,
  getZoneStatus,
  migrateLegacyAmmoZones,
} from '@/components/AmmoCheck';

function markAllItemsChecked() {
  return createDefaultZones().map((zone) => ({
    ...zone,
    sections: zone.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ ...item, checked: true })),
    })),
  }));
}

describe('AmmoCheck', () => {
  it('renders all zones and the Vers-Lade section', () => {
    render(<AmmoCheck />);

    expect(screen.getByRole('button', { name: /ZONE 1: De Vriezer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ZONE 2: De Koelkast/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ZONE 3: De Voorraadkast/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ZONE 4: Smaakmakers/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ZONE 2: De Koelkast/i }));
    expect(screen.getByText('De Vers-Lade')).toBeInTheDocument();
  });

  it('toggles an item in the correct section only', () => {
    render(<AmmoCheck />);

    fireEvent.click(screen.getByRole('button', { name: /ZONE 2: De Koelkast/i }));

    const paprikaCheckbox = screen.getByRole('checkbox', { name: /Paprika/i });
    const eierenCheckbox = screen.getByRole('checkbox', { name: /^Eieren/i });

    expect(paprikaCheckbox).toHaveAttribute('data-state', 'unchecked');
    expect(eierenCheckbox).toHaveAttribute('data-state', 'unchecked');

    fireEvent.click(paprikaCheckbox);

    expect(paprikaCheckbox).toHaveAttribute('data-state', 'checked');
    expect(eierenCheckbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('returns green zone status only when all required section items are checked', () => {
    const defaultZone = createDefaultZones()[0];
    expect(getZoneStatus(defaultZone)).toBe('red');

    const checkedZone = {
      ...defaultZone,
      sections: defaultZone.sections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({ ...item, checked: true })),
      })),
    };
    expect(getZoneStatus(checkedZone)).toBe('green');
  });

  it('returns locked only when every zone is green', () => {
    expect(getAllZonesStatus(createDefaultZones())).toBe('restock');
    expect(getAllZonesStatus(markAllItemsChecked())).toBe('locked');
  });

  it('migrates v1 item checks into v2 structure by item id', () => {
    const migrated = migrateLegacyAmmoZones([
      {
        id: 'koelkast',
        name: 'De Koelkast',
        items: [
          { id: 'eieren', name: 'legacy eieren', checked: true },
          { id: 'tonijn', name: 'legacy tonijn', checked: false },
        ],
      },
    ]);

    const koelkastZone = migrated.find((zone) => zone.id === 'koelkast');
    const voorraadkastZone = migrated.find((zone) => zone.id === 'voorraadkast');
    const eggsItem = koelkastZone?.sections.flatMap((section) => section.items).find((item) => item.id === 'eieren');
    const tunaItem = voorraadkastZone?.sections.flatMap((section) => section.items).find((item) => item.id === 'tonijn');

    expect(eggsItem?.checked).toBe(true);
    expect(tunaItem?.checked).toBe(false);
  });

  it('writes migrated v2 data to localStorage when only v1 exists', async () => {
    window.localStorage.setItem(
      'slowcarb-ammo-v1',
      JSON.stringify([
        {
          id: 'koelkast',
          name: 'De Koelkast',
          items: [{ id: 'eieren', name: 'legacy eieren', checked: true }],
        },
      ])
    );

    render(<AmmoCheck />);

    await waitFor(() => {
      expect(window.localStorage.getItem('slowcarb-ammo-v2')).not.toBeNull();
    });

    const storedV2 = JSON.parse(window.localStorage.getItem('slowcarb-ammo-v2') ?? '[]') as ReturnType<
      typeof createDefaultZones
    >;
    const eggsItem = storedV2
      .find((zone) => zone.id === 'koelkast')
      ?.sections.flatMap((section) => section.items)
      .find((item) => item.id === 'eieren');

    expect(eggsItem?.checked).toBe(true);
  });
});
