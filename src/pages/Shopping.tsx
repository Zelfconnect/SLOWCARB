import { ShieldCheck } from 'lucide-react';
import { AmmoCheck } from '@/components/AmmoCheck';

export function Shopping() {
  return (
    <div className="safe-bottom">
      <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sage-800">
          <ShieldCheck className="h-4 w-4" />
          Ammo Check
        </div>
        <p className="mt-2 text-sm text-stone-600">
          We gebruiken nu alleen Ammo Check voor dagelijkse focus en voorbereiding.
        </p>
      </div>
      <AmmoCheck />
    </div>
  );
}
