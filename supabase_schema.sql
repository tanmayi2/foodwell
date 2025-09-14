-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  dietary_restrictions TEXT[],
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  instructions JSONB NOT NULL,
  ingredients JSONB NOT NULL,
  time_minutes INTEGER NOT NULL,
  num_servings INTEGER NOT NULL,
  macros JSONB NOT NULL,
  tags JSONB NOT NULL,
  equipment_needed TEXT[],
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_recipes table (favorites and custom lists)
CREATE TABLE user_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  favorites INTEGER[] DEFAULT '{}',
  custom_lists JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fridges table
CREATE TABLE fridges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fridges ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for user_recipes
CREATE POLICY "Users can view own recipes" ON user_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON user_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON user_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for fridges
CREATE POLICY "Users can view own fridge" ON fridges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own fridge" ON fridges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fridge" ON fridges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recipes are public (no RLS needed, but you could add policies if needed)
-- For now, anyone can read recipes
CREATE POLICY "Anyone can view recipes" ON recipes
  FOR SELECT TO authenticated, anon USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  
  INSERT INTO public.user_recipes (user_id)
  VALUES (new.id);
  
  INSERT INTO public.fridges (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
