"use client";

import {
  Calendar,
  ChefHat,
  DollarSign,
  Heart,
  History,
  Home,
  LogOut,
  Refrigerator,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const customerNavigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "My Fridge", href: "/fridge", icon: Refrigerator },
  { name: "Recipes", href: "/recipes", icon: ChefHat },
  { name: "Recs", href: "/recommendations", icon: Heart },
  { name: "Meal Plan", href: "/meal-plan", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
];

const delivererNavigationItems = [
  { name: "Delivery History", href: "/delivery/history", icon: History },
  { name: "Earnings Summary", href: "/delivery/earnings", icon: DollarSign },
  { name: "Profile", href: "/delivery/profile", icon: User },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const profile = await response.json();
            setUserRole(profile.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  const navigationItems = customerNavigationItems;

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                FoodWell
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center space-x-1 px-6 py-2 min-w-[100px] justify-center",
                      isActive &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                      !isActive && "hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Button>
                </Link>
              );
            })}

            {/* Authentication UI */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={signOut}
                      className="flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="ml-4">
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
