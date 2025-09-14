"use client";

import { BookmarkPlus, Check, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recipe } from "@/types";
import { useRecipes } from "@/contexts/RecipeContext";

interface AddToListDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToListDialog({
  recipe,
  open,
  onOpenChange,
}: AddToListDialogProps) {
  const { userRecipeData, addToList, createList, removeFromList } =
    useRecipes();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  if (!recipe) return null;

  const handleToggleList = (listId: string) => {
    const isInList = isRecipeInList(listId);
    if (isInList) {
      removeFromList(listId, recipe.id);
    } else {
      addToList(listId, recipe.id);
    }
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim(), newListDescription.trim() || undefined);
      setNewListName("");
      setNewListDescription("");
      setShowCreateForm(false);
    }
  };

  const isRecipeInList = (listId: string) => {
    const list = userRecipeData.custom_lists.find((l) => l.id === listId);
    return list?.recipe_ids.includes(recipe.id) || false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkPlus className="h-5 w-5" />
            Add &quot;{recipe.name}&quot; to List
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Lists */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">
              Your Lists
            </h4>
            {userRecipeData.custom_lists.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No custom lists yet. Create one below!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {userRecipeData.custom_lists.map((list) => (
                  <div
                    key={list.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">{list.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          {list.recipe_ids.length} recipes
                        </Badge>
                      </div>
                      {list.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {list.description}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isRecipeInList(list.id) ? "default" : "outline"}
                      onClick={() => handleToggleList(list.id)}
                      className="ml-2"
                    >
                      {isRecipeInList(list.id) ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create New List */}
          <div className="border-t pt-4">
            {!showCreateForm ? (
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New List
              </Button>
            ) : (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">
                  Create New List
                </h4>
                <div>
                  <Label htmlFor="list-name">List Name</Label>
                  <Input
                    id="list-name"
                    placeholder="e.g., Dinner Party, Quick Meals"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="list-description">
                    Description (optional)
                  </Label>
                  <Input
                    id="list-description"
                    placeholder="Brief description of this list"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateList}
                    disabled={!newListName.trim()}
                    className="flex-1"
                  >
                    Create & Add Recipe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewListName("");
                      setNewListDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
