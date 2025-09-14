"use client";

import { useEffect, useState } from "react";

import { Navigation } from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const data = await response.json();
            console.log('Profile API response:', data);
            console.log('User role:', data.profile?.role);
            setUserRole(data.profile?.role);
          } else {
            console.log(
              "Profile API failed:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [user]);

  const showNavigation = !loading && userRole !== "deliverer";

  console.log("MainLayout debug:", { loading, userRole, showNavigation });

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && <Navigation />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
