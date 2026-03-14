import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { captureLandingEmail } from '@/lib/emailCapture';

type QuizQuestion = {
  id: string;
  titleKey: string;
  optionKeys: string[];
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'goal',
    titleKey: 'quiz.questions.goal',
    optionKeys: ['quiz.options.goal.0', 'quiz.options.goal.1', 'quiz.options.goal.2'],
  },
  {
    id: 'experience',
    titleKey: 'quiz.questions.experience',
    optionKeys: [
      'quiz.options.experience.0',
      'quiz.options.experience.1',
      'quiz.options.experience.2',
    ],
  },
  {
    id: 'challenge',
    titleKey: 'quiz.questions.challenge',
    optionKeys: ['quiz.options.challenge.0', 'quiz.options.challenge.1', 'quiz.options.challenge.2'],
  },
];

export default function QuizPage() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const currentQuestion = QUESTIONS[index];
  const isQuizDone = index >= QUESTIONS.length;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progress = useMemo(
    () => `${Math.min(index + 1, QUESTIONS.length)} / ${QUESTIONS.length}`,
    [index]
  );

  const handleSelect = (option: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (!selectedOption) return;
    setIndex((prev) => prev + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === 'submitting') return;

    setStatus('submitting');
    try {
      await captureLandingEmail(email);
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-6 shadow-card sm:p-8">
        <a href="/" className="text-sm font-medium text-sage-700 hover:text-sage-800">
          {String(t('quiz.backToHome'))}
        </a>

        <h1 className="mt-4 font-display text-3xl font-bold text-stone-900">
          {String(t('quiz.title'))}
        </h1>
        <p className="mt-2 text-sm text-stone-600">{String(t('quiz.subtitle'))}</p>

        {!isQuizDone && currentQuestion && (
          <section className="mt-8 space-y-5">
            <p className="text-sm font-semibold text-sage-700">{progress}</p>
            <h2 className="text-xl font-semibold text-stone-900">{String(t(currentQuestion.titleKey))}</h2>
            <div className="grid gap-3">
              {currentQuestion.optionKeys.map((optionKey) => {
                const optionText = String(t(optionKey));
                const isSelected = selectedOption === optionText;
                return (
                  <button
                    key={optionKey}
                    type="button"
                    onClick={() => handleSelect(optionText)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-sage-600 bg-sage-50 text-sage-800'
                        : 'border-stone-200 text-stone-700 hover:border-sage-200 hover:bg-sage-50/60'
                    }`}
                  >
                    {optionText}
                  </button>
                );
              })}
            </div>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!selectedOption}
              className="w-full rounded-xl bg-sage-600 text-white hover:bg-sage-700"
            >
              {String(t('quiz.nextButton'))}
            </Button>
          </section>
        )}

        {isQuizDone && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-stone-900">{String(t('quiz.emailTitle'))}</h2>
            <p className="mt-2 text-sm text-stone-600">{String(t('quiz.emailDescription'))}</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <label htmlFor="quiz-email" className="text-sm font-medium text-stone-700">
                {String(t('quiz.emailLabel'))}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="quiz-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder={String(t('quiz.emailPlaceholder'))}
                  className="h-11 flex-1 rounded-lg border border-stone-300 px-3 text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-300"
                />
                <Button
                  type="submit"
                  disabled={status === 'submitting' || !email.trim()}
                  className="h-11 rounded-lg bg-sage-600 px-4 text-white hover:bg-sage-700"
                >
                  {status === 'submitting'
                    ? String(t('quiz.emailSubmitting'))
                    : String(t('quiz.emailSubmitButton'))}
                </Button>
              </div>
            </form>

            {status === 'success' && (
              <p className="mt-3 text-sm font-medium text-sage-700">{String(t('quiz.emailSuccess'))}</p>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm font-medium text-clay-700">{String(t('quiz.emailError'))}</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
