export function AuthorCard() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-lg font-bold text-sage-700">
        J
      </div>
      <div>
        <p className="font-bold text-stone-900">Jesper</p>
        <p className="text-sm text-stone-500">
          Oprichter SlowCarb. Ex-militair, vader van drie. 8 kilo afgevallen met het slow carb protocol.
        </p>
      </div>
    </div>
  );
}
