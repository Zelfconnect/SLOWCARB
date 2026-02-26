import { yesNoList } from '@/data/education';
import { Check, X } from 'lucide-react';

export function YesNoReference() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Wat mag wel &amp; niet
        </h1>
        <p className="text-base text-stone-600">
          Print-screen dit als je wilt
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {/* YES column */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-600">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-sage-700">
              Mag wel
            </span>
          </div>
          <div className="space-y-1.5">
            {yesNoList.yes.map((item, i) => (
              <div
                key={item.item}
                className="rounded-xl bg-sage-50 px-3 py-2 text-sm text-sage-800"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.item}
              </div>
            ))}
          </div>
        </div>

        {/* NO column */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <X className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-red-600">
              Mag niet
            </span>
          </div>
          <div className="space-y-1.5">
            {yesNoList.no.map((item, i) => (
              <div
                key={item.item}
                className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
