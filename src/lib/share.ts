export type ShareOutcome = 'native' | 'clipboard' | 'aborted' | 'unavailable';

export interface ShareTextOptions {
  title?: string;
  text: string;
  url?: string;
}

function buildCopyText({ text, url }: ShareTextOptions): string {
  return [text, url].filter(Boolean).join('\n').trim();
}

async function copyWithClipboardApi(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function copyWithExecCommand(text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }

  return copied;
}

export async function shareText(options: ShareTextOptions): Promise<ShareOutcome> {
  const payload: ShareData = {
    title: options.title,
    text: options.text,
    url: options.url,
  };

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(payload);
      return 'native';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'aborted';
      }
    }
  }

  const copyText = buildCopyText(options);
  const copied = await copyWithClipboardApi(copyText) || copyWithExecCommand(copyText);
  return copied ? 'clipboard' : 'unavailable';
}
