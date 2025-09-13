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
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Recipes',
      description: 'Discover new recipes to try',
      icon: ChefHat,
      href: '/recipes',
      color: 'bg-orange-500'
    },
    {
      title: 'Recommendations',
      description: 'Personalized recipes just for you',
      icon: Heart,
      href: '/recommendations',
      color: 'bg-red-500'
    },
    {
      title: 'Meal Plan',
      description: 'Plan your weekly meals and track macros',
      icon: Calendar,
      href: '/meal-plan',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to FoodWell
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your smart grocery planning platform. Discover recipes, plan meals, 
          and generate shopping lists based on your preferences and dietary needs.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">2,000</p>
              <p className="text-sm text-gray-600">Daily Calorie Target</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <ChefHat className="h-8 w-8 text-orange-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-gray-600">Available Recipes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">25 min</p>
              <p className="text-sm text-gray-600">Avg Cook Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
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
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="text-center p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to start planning?
          </h3>
          <p className="text-gray-600 mb-4">
            Let&apos;s create your first meal plan and generate a shopping list.
          </p>
          <Link href="/meal-plan">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Meal Planning
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
