import { LayoutDashboard, ChefHat, BookOpen, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'recipes', label: 'Recepten', icon: ChefHat },
  { id: 'learn', label: 'Leren', icon: BookOpen },
  { id: 'ammo', label: 'AmmoCheck', icon: Package },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200 bg-white/90 backdrop-blur-md"
      style={{
        height: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-md items-center gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex h-full min-w-0 flex-1 shrink-0 flex-col items-center justify-center rounded-lg px-1 py-2 transition-all duration-200',
                isActive ? 'text-sage-600' : 'text-stone-400 hover:text-stone-600'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg transition-all duration-200',
                isActive && 'bg-sage-50'
              )}>
                <Icon 
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive && 'scale-110 fill-current'
                  )} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              <span className={cn(
                'text-xs font-medium mt-0.5 transition-colors text-center leading-tight',
                isActive ? 'text-sage-700' : 'text-stone-400'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
