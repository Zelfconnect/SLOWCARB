import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/?app=1`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Er ging iets mis. Probeer het opnieuw.');
      console.error('Magic link error:', error);
    } else {
      setStatus('sent');
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream px-5 py-8">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-8">
        {status === 'sent' ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-100">
              <CheckCircle2 className="h-10 w-10 text-sage-600" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-stone-800">
                Check je inbox
              </h1>
              <p className="text-base leading-relaxed text-stone-600">
                We hebben een inloglink gestuurd naar{' '}
                <span className="font-medium text-stone-800">{email}</span>.
                Klik op de link om in te loggen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-sm font-medium text-sage-600 underline underline-offset-2 hover:text-sage-700"
            >
              Ander e-mailadres gebruiken
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
                <Mail className="h-8 w-8 text-sage-600" />
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-stone-800">
                  Welkom terug
                </h1>
                <p className="text-base leading-relaxed text-stone-600">
                  Voer je e-mailadres in om een inloglink te ontvangen.
                  Geen wachtwoord nodig.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-email" className="sr-only">
                  E-mailadres
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.nl"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !email.trim()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sage-600 text-base font-semibold text-white shadow-soft transition-colors hover:bg-sage-700 disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Versturen…
                  </>
                ) : (
                  'Stuur inloglink'
                )}
              </button>
            </form>
          </>
        )}

        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar de homepage
        </a>
      </div>
    </div>
  );
}
