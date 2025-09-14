import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Refrigerator, 
  ChefHat, 
  Heart, 
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Home() {
  const quickActions = [
    {
      title: 'My Fridge',
      description: 'Check what ingredients you have available',
      icon: Refrigerator,
      href: '/fridge',
      color: 'bg-accent'
    },
    {
      title: 'Browse Recipes',
      description: 'Discover new recipes to try',
      icon: ChefHat,
      href: '/recipes',
      color: 'bg-secondary'
    },
    {
      title: 'Recommendations',
      description: 'Personalized recipes just for you',
      icon: Heart,
      href: '/recommendations',
      color: 'bg-primary'
    },
    {
      title: 'Meal Plan',
      description: 'Plan your weekly meals and track macros',
      icon: Calendar,
      href: '/meal-plan',
      color: 'bg-accent'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to FoodWell
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your smart grocery planning platform. Discover recipes, plan meals, 
          and generate shopping lists based on your preferences and dietary needs.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-accent mr-4" />
            <div>
              <p className="text-2xl font-bold">2,000</p>
              <p className="text-sm text-muted-foreground">Daily Calorie Target</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <ChefHat className="h-8 w-8 text-secondary mr-4" />
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">Available Recipes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-accent mr-4" />
            <div>
              <p className="text-2xl font-bold">25 min</p>
              <p className="text-sm text-muted-foreground">Avg Cook Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={action.href}>
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <CardContent className="text-center p-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to start planning?
          </h3>
          <p className="text-muted-foreground mb-4">
            Let&apos;s create your first meal plan and generate a shopping list.
          </p>
          <Link href="/meal-plan">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Meal Planning
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
