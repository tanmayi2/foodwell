'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Refrigerator, 
  ChefHat, 
  Heart, 
  Calendar,
  ShoppingCart,
  User
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'My Fridge', href: '/fridge', icon: Refrigerator },
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  { name: 'Recs', href: '/recommendations', icon: Heart },
  { name: 'Meal Plan', href: '/meal-plan', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">FoodWell</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                      !isActive && "hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
