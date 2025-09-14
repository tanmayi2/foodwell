"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  History,
  Package,
  TrendingUp,
  User,
} from "lucide-react";

import Link from "next/link";

export default function DeliveryDashboard() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content Area - Centered "No Active Orders" */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-24 text-muted-foreground mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-muted-foreground mb-2">
            No Active Orders
          </h2>
          <p className="text-lg text-muted-foreground">
            You'll see new delivery requests here when they become available
          </p>
        </div>
      </div>

      {/* Quick Actions at Bottom */}
      <div className="p-3 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          <Link href="/delivery/history">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <History className="h-6 w-6 text-primary mr-3" />
                <div>
                  <p className="font-medium">Past Deliveries</p>
                  <p className="text-xs text-muted-foreground">
                    View delivery history
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/delivery/earnings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Earnings History</p>
                  <p className="text-xs text-muted-foreground">
                    Track your income
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/delivery/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <User className="h-6 w-6 text-accent mr-3" />
                <div>
                  <p className="font-medium">Profile</p>
                  <p className="text-xs text-muted-foreground">
                    Update your info
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
