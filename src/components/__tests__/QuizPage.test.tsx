import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import QuizPage from '@/components/QuizPage';
import { captureLandingEmail } from '@/lib/emailCapture';

vi.mock('@/lib/emailCapture', () => ({
  captureLandingEmail: vi.fn(),
}));

const captureLandingEmailMock = vi.mocked(captureLandingEmail);

function completeQuiz() {
  fireEvent.click(screen.getByRole('button', { name: '3-5 kg' }));
  fireEvent.click(screen.getByRole('button', { name: /Volgende vraag/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Ik ben beginner' }));
  fireEvent.click(screen.getByRole('button', { name: /Volgende vraag/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Snacks en trek tussendoor' }));
  fireEvent.click(screen.getByRole('button', { name: /Volgende vraag/i }));
}

afterEach(() => {
  captureLandingEmailMock.mockReset();
});

describe('QuizPage', () => {
  it('shows email capture after completing all quiz questions', () => {
    render(<QuizPage />);

    expect(screen.getByText(/Doe de SlowCarb quiz/i)).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    completeQuiz();

    expect(screen.getByText(/Bijna klaar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mailadres/i)).toBeInTheDocument();
  });

  it('captures email after quiz completion and shows success state', async () => {
    captureLandingEmailMock.mockResolvedValueOnce();
    render(<QuizPage />);

    completeQuiz();
    fireEvent.change(screen.getByLabelText(/E-mailadres/i), {
      target: { value: 'Test@Example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Verstuur/i }));

    await waitFor(() => {
      expect(captureLandingEmailMock).toHaveBeenCalledWith('Test@Example.com');
    });

    expect(
      screen.getByText(/Top, je staat op de lijst. We houden je op de hoogte./i)
    ).toBeInTheDocument();
  });
});
