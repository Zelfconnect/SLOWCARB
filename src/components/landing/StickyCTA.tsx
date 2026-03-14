import { useState, useEffect } from 'react';

interface StickyCTAProps {
  onCheckout: () => void;
}

export function StickyCTA({ onCheckout }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offerHeadline = document.getElementById('offer-headline');
    if (!offerHeadline) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.boundingClientRect.top < 0 && !entry.isIntersecting) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(offerHeadline);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-surface-paper/95 backdrop-blur-md border-t border-sage-200 p-4 z-50 transform transition-transform duration-300 md:hidden flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex flex-col">
        <span className="meta-copy text-ink-muted line-through">&euro;79</span>
        <span className="text-2xl font-extrabold font-sans text-ink-strong leading-none">Nu &euro;47</span>
      </div>
      <button onClick={onCheckout} className="cta-accent-button px-6 py-3 text-xs">
        Begin voor &euro;47
      </button>
    </div>
  );
}
