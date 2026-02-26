interface ThePromiseProps {
  name: string;
}

const stats = [
  { value: '3', label: 'maaltijden per dag', emoji: '\u{1F37D}\uFE0F' },
  { value: '5', label: 'simpele regels', emoji: '\u{1F4CB}' },
  { value: '1', label: 'cheat day per week', emoji: '\u{1F389}' },
];

export function ThePromise({ name }: ThePromiseProps) {
  return (
    <section className="flex flex-1 flex-col items-center">
      <div className="mt-4 space-y-4 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          {name}, dit gaat werken.
        </h1>
        <p className="text-base text-stone-600">
          Het Slow-Carb protocol is simpeler dan je denkt
        </p>
      </div>

      <div className="mt-10 grid w-full grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl border border-stone-200 bg-white/80 p-4 text-center"
          >
            <span className="text-3xl leading-none">{stat.emoji}</span>
            <p className="mt-3 font-display text-2xl font-bold text-sage-700">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium leading-tight text-stone-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
