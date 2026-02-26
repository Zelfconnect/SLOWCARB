const floatingDots = [
  { top: '12%', left: '8%', size: 6, opacity: 0.4, delay: '0s' },
  { top: '20%', right: '12%', size: 8, opacity: 0.3, delay: '0.5s' },
  { top: '45%', left: '5%', size: 5, opacity: 0.35, delay: '1s' },
  { top: '60%', right: '8%', size: 7, opacity: 0.25, delay: '1.5s' },
  { top: '75%', left: '15%', size: 4, opacity: 0.3, delay: '0.8s' },
  { top: '85%', right: '20%', size: 6, opacity: 0.2, delay: '1.2s' },
];

export function WelcomeHero() {
  return (
    <>
      <style>{`
        @keyframes float-dot {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.1); }
        }
      `}</style>

      {/* Floating dots */}
      {floatingDots.map((dot, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full bg-white"
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            animation: `float-dot 3s ease-in-out ${dot.delay} infinite`,
          }}
        />
      ))}

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-sage-200">
          Slow-Carb Protocol
        </p>

        <h1 className="font-display text-[2.5rem] font-bold leading-[1.1] text-white sm:text-5xl">
          8-10 kg lichter
          <br />
          in 6 weken
        </h1>

        <p className="mt-6 max-w-[280px] text-lg leading-relaxed text-sage-100/80">
          Geen calorie&euml;n tellen. Geen honger.
          <br />
          E&eacute;n simpel protocol.
        </p>
      </div>
    </>
  );
}
