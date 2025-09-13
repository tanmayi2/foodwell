import fs from 'fs/promises';
import path from 'path';
import { User, Recipe, Fridge, MealPlanEntry, GroceryItem, UserRecipeData } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic JSON file operations
async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// User operations
export async function getUsers(): Promise<User[]> {
  return readJsonFile<User>('users.json');
}

export async function getUserById(id: number): Promise<User | null> {
  const users = await getUsers();
  return users.find(user => user.id === id) || null;
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User | null> {
  const users = await getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...userData };
  await writeJsonFile('users.json', users);
  return users[userIndex];
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const users = await getUsers();
  const newId = Math.max(0, ...users.map(u => u.id)) + 1;
  const newUser: User = { ...userData, id: newId };
  
  users.push(newUser);
  await writeJsonFile('users.json', users);
  return newUser;
}

// Recipe operations
export async function getRecipes(): Promise<Recipe[]> {
  return readJsonFile<Recipe>('recipes.json');
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const recipes = await getRecipes();
  return recipes.find(recipe => recipe.id === id) || null;
}

// Fridge operations
export async function getFridge(userId: number): Promise<Fridge | null> {
  const fridges = await readJsonFile<Fridge>('fridges.json');
  return fridges.find(fridge => fridge.id === userId) || null;
}

export async function updateFridge(userId: number, fridgeData: Partial<Fridge>): Promise<Fridge> {
  const fridges = await readJsonFile<Fridge>('fridges.json');
  const fridgeIndex = fridges.findIndex(fridge => fridge.id === userId);
  
  if (fridgeIndex === -1) {
    // Create new fridge
    const newFridge: Fridge = { id: userId, items: [], ...fridgeData };
    fridges.push(newFridge);
    await writeJsonFile('fridges.json', fridges);
    return newFridge;
  }
  
  fridges[fridgeIndex] = { ...fridges[fridgeIndex], ...fridgeData };
  await writeJsonFile('fridges.json', fridges);
  return fridges[fridgeIndex];
}

// Meal plan operations
export async function getMealPlan(userId: number): Promise<MealPlanEntry[]> {
  const mealPlans = await readJsonFile<MealPlanEntry & { user_id: number }>('meal-plans.json');
  return mealPlans.filter(entry => entry.user_id === userId);
}

export async function updateMealPlan(userId: number, mealPlan: MealPlanEntry[]): Promise<void> {
  const allMealPlans = await readJsonFile<MealPlanEntry & { user_id: number }>('meal-plans.json');
  
  // Remove existing entries for this user
  const otherUserPlans = allMealPlans.filter(entry => entry.user_id !== userId);
  
  // Add new entries with user_id
  const newUserPlans = mealPlan.map(entry => ({ ...entry, user_id: userId }));
  
  await writeJsonFile('meal-plans.json', [...otherUserPlans, ...newUserPlans]);
}

// Grocery list operations
export async function getGroceryList(userId: number): Promise<GroceryItem[]> {
  const groceryLists = await readJsonFile<{ user_id: number; items: GroceryItem[] }>('grocery-lists.json');
  const userList = groceryLists.find(list => list.user_id === userId);
  return userList?.items || [];
}

export async function updateGroceryList(userId: number, items: GroceryItem[]): Promise<void> {
  const groceryLists = await readJsonFile<{ user_id: number; items: GroceryItem[] }>('grocery-lists.json');
  const listIndex = groceryLists.findIndex(list => list.user_id === userId);
  
  if (listIndex === -1) {
    groceryLists.push({ user_id: userId, items });
  } else {
    groceryLists[listIndex].items = items;
  }
  
  await writeJsonFile('grocery-lists.json', groceryLists);
}
