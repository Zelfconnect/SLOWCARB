import { useState } from 'react';

import { Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function QuickActionFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {open ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Snelle actie"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-600 text-white shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="h-6 w-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={12}
          className="z-[60]"
        >
          <DropdownMenuItem onClick={() => console.log('Log Maaltijd')}>
            Log Maaltijd
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Log Gewicht')}>
            Log Gewicht
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
