import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameInputProps {
  name: string;
  onChange: (name: string) => void;
  onEnter: () => void;
}

export function NameInput({ name, onChange, onEnter }: NameInputProps) {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-sage-600">
          Stap 1
        </p>
        <h1 className="font-display text-3xl font-bold text-stone-900">
          H&eacute;, hoe heet je?
        </h1>
        <p className="text-base text-stone-500">
          We personaliseren jouw slow-carbtraject
        </p>
      </div>

      <div className="mt-10 space-y-3">
        <Label htmlFor="onb-name" className="text-sm font-medium text-stone-700">
          Je naam
        </Label>
        <Input
          id="onb-name"
          autoFocus
          placeholder="bv. Jessie"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onEnter()}
          className="input-premium h-14 text-lg text-stone-900"
        />
      </div>
    </section>
  );
}
