import { Plus } from 'lucide-react';

interface QuickActionFABProps {
  onLogWeight?: () => void;
}

export function QuickActionFAB({ onLogWeight }: QuickActionFABProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        type="button"
        aria-label="Log gewicht"
        onClick={onLogWeight}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-600 text-white shadow-lg transition-transform hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
