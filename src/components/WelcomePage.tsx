import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, Loader2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();

const confettiColors = ['#729c72', '#527e52', '#c5855a', '#dec0a3', '#9bbd9b', '#e3ebe3'];

const confettiDots = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  size: 6 + ((index * 5) % 7),
  delay: `${(index * 170) % 1600}ms`,
  duration: `${3400 + ((index * 260) % 2200)}ms`,
  color: confettiColors[index % confettiColors.length],
}));

type WelcomeStatus = 'loading' | 'confirm' | 'sent' | 'error' | 'legacy';

export default function WelcomePage() {
  const [status, setStatus] = useState<WelcomeStatus>('loading');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Grant access — token value is unique per session, not hardcoded
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, crypto.randomUUID());

    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!isSupabaseConfigured || !SUPABASE_URL || !sessionId) {
      // No session_id → legacy flow (direct Stripe redirect without session_id)
      setStatus('legacy');
      return;
    }

    // Verify the Stripe session to get the customer email
    fetch(`${SUPABASE_URL}/functions/v1/verify-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setEmail(data.email);
          setStatus('confirm');
        } else {
          // Couldn't get email — fall back to legacy flow
          setStatus('legacy');
        }
      })
      .catch(() => {
        setStatus('legacy');
      });
  }, []);

  const sendMagicLink = async () => {
    if (!supabase) {
      setStatus('legacy');
      return;
    }

    setStatus('loading');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/?app=1`,
      },
    });

    if (error) {
      setErrorMsg('Er ging iets mis bij het versturen. Probeer het opnieuw.');
      setStatus('error');
      console.error('Magic link error:', error);
    } else {
      setStatus('sent');
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-sage-600" />
          <p className="text-stone-600">Even geduld…</p>
        </div>
      );
    }

    if (status === 'sent') {
      return (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 shadow-soft">
            <Mail className="h-10 w-10 text-sage-600" />
          </div>
          <section className="space-y-3">
            <h1 className="font-display text-3xl font-bold text-stone-800">Check je inbox</h1>
            <p className="text-base leading-relaxed text-stone-600">
              We hebben een inloglink gestuurd naar{' '}
              <span className="font-medium text-stone-800">{email}</span>.
              Hiermee kun je altijd opnieuw inloggen, ook op een ander apparaat.
            </p>
          </section>
          <a
            href="/?app=1"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-sage-600 px-8 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-sage-700"
          >
            Open SlowCarb →
          </a>
        </>
      );
    }

    if (status === 'confirm') {
      return (
        <>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100 shadow-soft">
            <CheckCircle2 className="h-14 w-14 text-sage-600" strokeWidth={2.4} />
          </div>
          <section className="space-y-3">
            <h1 className="font-display text-4xl font-bold text-stone-800">
              Welkom bij SlowCarb!
            </h1>
            <p className="text-base leading-relaxed text-stone-600">
              Je hebt de beste beslissing van het jaar gemaakt.
              We sturen een inloglink naar{' '}
              <span className="font-medium text-stone-800">{email}</span>{' '}
              zodat je altijd toegang houdt.
            </p>
          </section>
          <button
            type="button"
            onClick={sendMagicLink}
            className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-sage-600 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-sage-700"
          >
            <Mail className="h-5 w-5" />
            Stuur inloglink
          </button>
          <a
            href="/?app=1"
            className="text-sm font-medium text-stone-500 underline underline-offset-2 hover:text-stone-700"
          >
            Sla over en open de app →
          </a>
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100 shadow-soft">
            <CheckCircle2 className="h-14 w-14 text-sage-600" strokeWidth={2.4} />
          </div>
          <section className="space-y-3">
            <h1 className="font-display text-4xl font-bold text-stone-800">
              Welkom bij SlowCarb!
            </h1>
            <p className="text-sm text-red-600">{errorMsg}</p>
          </section>
          <button
            type="button"
            onClick={sendMagicLink}
            className="inline-flex h-14 w-full max-w-xs items-center justify-center rounded-xl bg-sage-600 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-sage-700"
          >
            Probeer opnieuw
          </button>
          <a
            href="/?app=1"
            className="text-sm font-medium text-stone-500 underline underline-offset-2 hover:text-stone-700"
          >
            Sla over en open de app →
          </a>
        </>
      );
    }

    // status === 'legacy' — original flow without session_id
    return (
      <>
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100 shadow-soft">
          <CheckCircle2 className="h-14 w-14 text-sage-600" strokeWidth={2.4} />
        </div>
        <section className="space-y-3">
          <h1 className="font-display text-4xl font-bold text-stone-800">Welkom bij SlowCarb!</h1>
          <p className="text-base leading-relaxed text-stone-600">
            Je hebt de beste beslissing van het jaar gemaakt. Tijd om te beginnen.
          </p>
        </section>
        <section className="w-full rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-card">
          <ol className="space-y-4">
            <li className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="font-display text-base font-semibold text-stone-800">1. Voeg SlowCarb toe aan je homescreen</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Open het browsermenu en kies de optie om deze app op je beginscherm te zetten voor snelle toegang.
              </p>
            </li>
            <li className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="font-display text-base font-semibold text-stone-800">2. Check de 5 regels in het Leren-tabblad</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Neem twee minuten om de basisregels te lezen, zodat je vandaag direct goed start.
              </p>
            </li>
            <li className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="font-display text-base font-semibold text-stone-800">3. Kies je eerste recept en start je boodschappenlijst</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Selecteer een recept dat je lekker vindt en voeg alle ingrediënten met een tik toe aan je lijst.
              </p>
            </li>
          </ol>
        </section>
        <a
          href="/?app=1"
          className="inline-flex h-14 items-center justify-center rounded-xl bg-sage-600 px-8 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-sage-700"
        >
          Open SlowCarb →
        </a>
      </>
    );
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-cream px-5 py-8">
      <style>{`
        @keyframes welcome-confetti-fall {
          0% {
            transform: translate3d(0, -15vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, 115vh, 0) rotate(360deg);
            opacity: 0;
          }
        }

        .welcome-confetti-dot {
          animation-name: welcome-confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {confettiDots.map((dot) => (
          <span
            key={dot.id}
            className="welcome-confetti-dot absolute -top-12 rounded-full"
            style={{
              left: dot.left,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              backgroundColor: dot.color,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        ))}
      </div>

      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col items-center justify-center gap-8 text-center">
        {renderContent()}
      </main>
    </div>
  );
}
