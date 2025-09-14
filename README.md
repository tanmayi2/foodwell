# FoodWell: The AI-First Instacart
[Video Demo](https://youtu.be/OcNjoTPtKyQ?si=QXaifWTh_xLXnltY) 

## 🛒 The Challenge: Rebuilding Instacart for the AI Era

What if Instacart was built today, from the ground up, with AI at its core? FoodWell is that answer—born from the daily struggles of college students trying to meal prep on a budget while juggling classes, work, and social life.

## 🏫 Our Origin Story: College Student Meal Prep Hell

**The Problem We Lived:**
- Standing in grocery aisles with a recipe, trying and struggling to plan out the week
- Buying ingredients for one recipe, then having random leftovers go bad
- Spending 2+ hours every Sunday planning meals, making lists, and visiting multiple stores
- Choosing between eating healthy and staying within a tight budget
- Recipe apps that don't consider what's actually in your fridge, kitchen or local stores

**The Lightbulb Moment:** What if an AI could instantly know what's available at every store near you, suggest recipes based on your fridge contents, and optimize your entire shopping experience—all before you even leave your dorm?

## FoodWell: Instacart Reimagined with AI-First Thinking

### Why AI-First Beats Traditional Instacart

**Traditional Instacart:** You know what you want → You order it → It gets delivered
**FoodWell:** AI knows what you need before you do → Optimizes everything → You eat better for less

### 🧠 The AI Advantage

**1. Predictive Intelligence**
- AI agents analyze your fridge contents, dietary preferences, and budget constraints
- Suggests complete meal plans that use ingredients efficiently across multiple recipes
- Predicts when you'll run out of staples and auto-suggests restocking

**2. Real-Time Optimization**
- Live inventory tracking across all local stores
- Dynamic pricing comparison that saves you money on every item
- Route optimization for multi-store shopping (something Instacart can't do)

**3. Waste Elimination**
- AI ensures every ingredient you buy gets used in multiple recipes
- Tracks expiration dates and suggests recipes to use items before they spoil
- Learns your consumption patterns to prevent over-buying

### 🎓 Built for the Modern Student (and Everyone Else)

**The Student Use Case:**
- "I have $50 for groceries this week and 3 hours to meal prep"
- AI instantly generates a complete meal plan with shopping list optimized for your budget and schedule
- Suggests recipes that share ingredients to minimize waste and cost

**But It Scales Beyond Students:**
- Busy professionals who want healthy meals without the planning overhead
- Families managing complex dietary restrictions across multiple members
- Anyone who's tired of food waste and wants to eat better for less

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui for modern, accessible design
- **AI Integration**: Toolhouse AI agents for ingredient and recipe intelligence
- **Data Management**: JSON-based data store with TypeScript interfaces
- **Styling**: Modern responsive design with dark/light mode support

## 🏗️ The AI-First Architecture That Changes Everything

Unlike Instacart's traditional marketplace model, FoodWell is built around intelligent agents that work together:

- **Ingredient Intelligence Agent**: Real-time inventory and pricing across all local stores
- **Recipe Optimization Agent**: Suggests meals that maximize ingredient overlap and minimize waste
- **Budget Optimization Agent**: Finds the cheapest combination of stores for your shopping list
- **Predictive Planning Agent**: Learns your patterns to suggest meals before you're even hungry

## 💡 The Instacart Disruption Strategy

### What Instacart Does Well (That We Keep):
✅ On-demand grocery delivery  
✅ Store partnerships and inventory access  
✅ User-friendly mobile experience  

### Where Instacart Falls Short (That We Fix):
❌ **Reactive, not proactive** → We predict what you need  
❌ **Single-store focus** → We optimize across all stores  
❌ **No meal planning intelligence** → We plan your entire week  
❌ **Doesn't prevent food waste** → We ensure every ingredient gets used  
❌ **No budget optimization** → We find the cheapest path to great meals  

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Toolhouse API key (for AI agents)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foodwell
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Toolhouse API credentials
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see FoodWell in action!


## Repo Structure

``` bash
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── fridge/            # Fridge management page
│   ├── recipes/           # Recipe library page
│   ├── recommendations/   # Recipe recommendations
│   ├── meal-plan/         # Meal planning & lists
│   └── profile/           # User profile & preferences
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, cards, etc.)
│   └── layout/           # Layout components (navigation, etc.)
├── contexts/             # React contexts
├── lib/                  # Utilities and enums
└── types/               # TypeScript type definitions

data/                     # JSON data files
├── fridges.json         # Fridge inventory data
├── recipes.json         # Recipe database
├── users.json           # User profiles
└── user-recipes.json    # User-specific recipe data
```
