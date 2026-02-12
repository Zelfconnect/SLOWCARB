import { LayoutDashboard, ChefHat, BookOpen, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'recipes', label: 'Recepten', icon: ChefHat },
  { id: 'learn', label: 'Leren', icon: BookOpen },
  { id: 'shopping', label: 'Boodschappen', icon: ShoppingCart },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-warm-200 z-30">
      <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-2 rounded-lg transition-all duration-200',
                isActive ? 'text-primary-600' : 'text-warm-400 hover:text-warm-600'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg transition-all duration-200',
                isActive && 'bg-primary-50'
              )}>
                <Icon 
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive && 'scale-110'
                  )} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              <span className={cn(
                'text-xs font-medium mt-0.5 transition-colors',
                isActive ? 'text-primary-700' : 'text-warm-400'
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
