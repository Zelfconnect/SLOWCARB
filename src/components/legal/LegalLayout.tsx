import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

type LegalLayoutProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export function LegalLayout({ title, intro, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-cream text-stone-600">
      <div className="mx-auto max-w-3xl px-6 py-12 font-['Source_Sans_3'] text-base leading-relaxed">
        <a
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:-translate-x-0.5 hover:bg-white"
          href="/"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          <span>Terug naar home</span>
        </a>

        <header className="mt-8 space-y-4">
          <h1 className="font-['Fraunces'] text-4xl font-black text-stone-800">{title}</h1>
          {intro ? <p>{intro}</p> : null}
        </header>

        <div className="mt-10 space-y-8 [&_a]:font-semibold [&_a]:text-stone-800 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-['Fraunces'] [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-stone-800 [&_li]:text-base [&_p]:text-base [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </main>
  );
}
