type EmailCaptureRecord = {
  email: string;
  source: 'landing_page';
  createdAt: string;
};

const STORAGE_KEY = 'slowcarb-email-captures';

function loadCaptures(): EmailCaptureRecord[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EmailCaptureRecord[]) : [];
  } catch {
    return [];
  }
}

function saveCaptures(captures: EmailCaptureRecord[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captures));
}

export async function captureLandingEmail(email: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Window is not available');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Invalid email');
  }

  const captures = loadCaptures();
  const alreadyCaptured = captures.some((item) => item.email === normalizedEmail);
  if (alreadyCaptured) return;

  captures.push({
    email: normalizedEmail,
    source: 'landing_page',
    createdAt: new Date().toISOString(),
  });
  saveCaptures(captures);
}
