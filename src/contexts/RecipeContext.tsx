'use client';

import React, { createContext, useContext, useState } from 'react';
import { Recipe, UserRecipeData, RecipeList } from '@/types';
import { mockUserRecipeData } from '@/lib/mockData';

interface RecipeContextType {
  userRecipeData: UserRecipeData;
  toggleFavorite: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
  createList: (name: string, description?: string) => void;
  addToList: (listId: string, recipeId: number) => void;
  removeFromList: (listId: string, recipeId: number) => void;
  deleteList: (listId: string) => void;
  getRecipesInList: (listId: string, allRecipes: Recipe[]) => Recipe[];
  getFavoriteRecipes: (allRecipes: Recipe[]) => Recipe[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [userRecipeData, setUserRecipeData] = useState<UserRecipeData>(mockUserRecipeData);

  const toggleFavorite = (recipeId: number) => {
    setUserRecipeData(prev => ({
      ...prev,
      favorites: prev.favorites.includes(recipeId)
        ? prev.favorites.filter(id => id !== recipeId)
        : [...prev.favorites, recipeId]
    }));
  };

  const isFavorite = (recipeId: number) => {
    return userRecipeData.favorites.includes(recipeId);
  };

  const createList = (name: string, description?: string) => {
    const newList: RecipeList = {
      id: `list-${Date.now()}`,
      name,
      description,
      recipe_ids: [],
      created_at: new Date().toISOString(),
      user_id: userRecipeData.user_id
    };

    setUserRecipeData(prev => ({
      ...prev,
      custom_lists: [...prev.custom_lists, newList]
    }));
  };

  const addToList = (listId: string, recipeId: number) => {
    setUserRecipeData(prev => ({
      ...prev,
      custom_lists: prev.custom_lists.map(list =>
        list.id === listId && !list.recipe_ids.includes(recipeId)
          ? { ...list, recipe_ids: [...list.recipe_ids, recipeId] }
          : list
      )
    }));
  };

  const removeFromList = (listId: string, recipeId: number) => {
    setUserRecipeData(prev => ({
      ...prev,
      custom_lists: prev.custom_lists.map(list =>
        list.id === listId
          ? { ...list, recipe_ids: list.recipe_ids.filter(id => id !== recipeId) }
          : list
      )
    }));
  };

  const deleteList = (listId: string) => {
    setUserRecipeData(prev => ({
      ...prev,
      custom_lists: prev.custom_lists.filter(list => list.id !== listId)
    }));
  };

  const getRecipesInList = (listId: string, allRecipes: Recipe[]): Recipe[] => {
    const list = userRecipeData.custom_lists.find(l => l.id === listId);
    if (!list) return [];
    
    return allRecipes.filter(recipe => list.recipe_ids.includes(recipe.id));
  };

  const getFavoriteRecipes = (allRecipes: Recipe[]): Recipe[] => {
    return allRecipes.filter(recipe => userRecipeData.favorites.includes(recipe.id));
  };

  return (
    <RecipeContext.Provider value={{
      userRecipeData,
      toggleFavorite,
      isFavorite,
      createList,
      addToList,
      removeFromList,
      deleteList,
      getRecipesInList,
      getFavoriteRecipes
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
