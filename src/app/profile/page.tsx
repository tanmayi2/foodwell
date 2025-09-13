"use client";

import {
  Allergen,
  Cuisine,
  DietaryRestriction,
  FlavorProfile,
  Ingredient,
  Priority,
  getAllergens,
  getCuisines,
  getDietaryRestrictions,
  getDisplayName,
  getFlavorProfiles,
  getIngredients,
  getPriorities,
} from "@/lib/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Plus, Save, Trash2, User as UserIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/1');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setUser(userData);
      setEditedUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (user) {
      setEditedUser({ ...user });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editedUser) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/users/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({ ...user });
      setIsEditing(false);
    }
  };

  const updateField = (field: keyof User, value: any) => {
    if (editedUser) {
      setEditedUser((prev) => prev ? ({ ...prev, [field]: value }) : null);
    }
  };

  const updateNestedField = (
    field: keyof User,
    subField: string,
    value: any
  ) => {
    if (editedUser) {
      setEditedUser((prev) => prev ? ({
        ...prev,
        [field]: { ...prev[field], [subField]: value },
      }) : null);
    }
  };

  const addToArray = (field: keyof User, value: string) => {
    if (value.trim() && editedUser) {
      setEditedUser((prev) => prev ? ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }) : null);
    }
  };

  const removeFromArray = (field: keyof User, index: number) => {
    if (editedUser) {
      setEditedUser((prev) => prev ? ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }) : null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <p className="text-lg font-medium">Error loading profile</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchUser}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No user data found</div>
      </div>
    );
  }

  const currentUser = isEditing ? editedUser : user;
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancel} variant="outline" disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={currentUser.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              ) : (
                <p className="text-lg font-medium">{currentUser.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="id">User ID</Label>
              <p className="text-lg font-medium text-gray-600">
                #{currentUser.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={currentUser.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              ) : (
                <p className="text-lg">{currentUser.address}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City, State, ZIP</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="City"
                    value={currentUser.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={currentUser.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-20"
                  />
                  <Input
                    placeholder="ZIP"
                    value={currentUser.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    className="w-24"
                  />
                </div>
              ) : (
                <p className="text-lg">
                  {currentUser.city}, {currentUser.state} {currentUser.zip}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Dietary Restrictions
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.dietary_restrictions.map((restriction, index) => (
                <div key={restriction} className="flex items-center gap-1">
                  <Badge variant="default" className="capitalize">
                    {getDisplayName(restriction)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            dietary_restrictions:
                              editedUser.dietary_restrictions.filter(
                                (_, i) => i !== index
                              ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.dietary_restrictions.length === 0 && (
                <p className="text-gray-500 text-sm">No dietary restrictions</p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.dietary_restrictions.includes(
                      value as DietaryRestriction
                    )
                  ) {
                    setEditedUser({
                      ...editedUser,
                      dietary_restrictions: [
                        ...editedUser.dietary_restrictions,
                        value as DietaryRestriction,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add restriction" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getDietaryRestrictions()
                    .filter(
                      (r) => !currentUser.dietary_restrictions.includes(r)
                    )
                    .map((restriction) => (
                      <SelectItem key={restriction} value={restriction}>
                        {getDisplayName(restriction)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Allergies</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.allergies.map((allergy, index) => (
                <div key={allergy} className="flex items-center gap-1">
                  <Badge variant="destructive" className="capitalize">
                    {getDisplayName(allergy)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            allergies: editedUser.allergies.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.allergies.length === 0 && (
                <p className="text-gray-500 text-sm">No allergies</p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.allergies.includes(value as Allergen)
                  ) {
                    setEditedUser({
                      ...editedUser,
                      allergies: [...editedUser.allergies, value as Allergen],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add allergy" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getAllergens()
                    .filter((a) => !currentUser.allergies.includes(a))
                    .map((allergen) => (
                      <SelectItem key={allergen} value={allergen}>
                        {getDisplayName(allergen)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Liked Cuisines */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Liked Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.liked_cuisines.map((cuisine, index) => (
                <div key={cuisine} className="flex items-center gap-1">
                  <Badge variant="outline" className="capitalize">
                    {getDisplayName(cuisine)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            liked_cuisines: editedUser.liked_cuisines.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.liked_cuisines.length === 0 && (
                <p className="text-gray-500 text-sm">No cuisine preferences</p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.liked_cuisines.includes(value as Cuisine)
                  ) {
                    setEditedUser({
                      ...editedUser,
                      liked_cuisines: [
                        ...editedUser.liked_cuisines,
                        value as Cuisine,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add cuisine" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getCuisines()
                    .filter((c) => !currentUser.liked_cuisines.includes(c))
                    .map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {getDisplayName(cuisine)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Disliked Cuisines */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Disliked Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.disliked_cuisines.map((cuisine, index) => (
                <div key={cuisine} className="flex items-center gap-1">
                  <Badge variant="secondary" className="capitalize">
                    {getDisplayName(cuisine)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            disliked_cuisines: editedUser.disliked_cuisines.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.disliked_cuisines.length === 0 && (
                <p className="text-gray-500 text-sm">No disliked cuisines</p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.disliked_cuisines.includes(value as Cuisine)
                  ) {
                    setEditedUser({
                      ...editedUser,
                      disliked_cuisines: [
                        ...editedUser.disliked_cuisines,
                        value as Cuisine,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add disliked cuisine" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getCuisines()
                    .filter((c) => !currentUser.disliked_cuisines.includes(c))
                    .map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {getDisplayName(cuisine)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Liked Ingredients */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Liked Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.liked_ingredients.map((ingredient, index) => (
                <div key={ingredient} className="flex items-center gap-1">
                  <Badge variant="outline" className="capitalize">
                    {getDisplayName(ingredient)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            liked_ingredients: editedUser.liked_ingredients.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.liked_ingredients.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No ingredient preferences
                </p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.liked_ingredients.includes(value as Ingredient)
                  ) {
                    setEditedUser({
                      ...editedUser,
                      liked_ingredients: [
                        ...editedUser.liked_ingredients,
                        value as Ingredient,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add ingredient" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getIngredients()
                    .filter((i) => !currentUser.liked_ingredients.includes(i))
                    .map((ingredient) => (
                      <SelectItem key={ingredient} value={ingredient}>
                        {getDisplayName(ingredient)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Disliked Ingredients */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Disliked Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.disliked_ingredients.map((ingredient, index) => (
                <div key={ingredient} className="flex items-center gap-1">
                  <Badge variant="secondary" className="capitalize">
                    {getDisplayName(ingredient)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            disliked_ingredients:
                              editedUser.disliked_ingredients.filter(
                                (_, i) => i !== index
                              ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.disliked_ingredients.length === 0 && (
                <p className="text-gray-500 text-sm">No disliked ingredients</p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.disliked_ingredients.includes(value as Ingredient)
                  ) {
                    setEditedUser({
                      ...editedUser,
                      disliked_ingredients: [
                        ...editedUser.disliked_ingredients,
                        value as Ingredient,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add disliked ingredient" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getIngredients()
                    .filter((i) => !currentUser.disliked_ingredients.includes(i))
                    .map((ingredient) => (
                      <SelectItem key={ingredient} value={ingredient}>
                        {getDisplayName(ingredient)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Flavor Preferences */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Flavor Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.liked_flavor_profile.map((flavor, index) => (
                <div key={flavor} className="flex items-center gap-1">
                  <Badge variant="outline" className="capitalize">
                    {getDisplayName(flavor)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            liked_flavor_profile:
                              editedUser.liked_flavor_profile.filter(
                                (_, i) => i !== index
                              ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.liked_flavor_profile.length === 0 && (
                <p className="text-gray-500 text-sm">No flavor preferences</p>
              )}
            </div>
            {isEditing && (
              <Select
                onValueChange={(value) => {
                  if (
                    value &&
                    editedUser &&
                    !currentUser.liked_flavor_profile.includes(value as FlavorProfile)
                  ) {
                    setEditedUser({
                      ...editedUser,
                      liked_flavor_profile: [
                        ...editedUser.liked_flavor_profile,
                        value as FlavorProfile,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full h-6">
                  <SelectValue placeholder="Add flavor preference" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {getFlavorProfiles()
                    .filter((f) => !currentUser.liked_flavor_profile.includes(f))
                    .map((flavor) => (
                      <SelectItem key={flavor} value={flavor}>
                        {getDisplayName(flavor)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Macro Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Macro Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { key: "calories", label: "Calories", color: "text-orange-600" },
              {
                key: "protein_g",
                label: "Protein (g)",
                color: "text-green-600",
              },
              { key: "carbs_g", label: "Carbs (g)", color: "text-blue-600" },
              { key: "fat_g", label: "Fat (g)", color: "text-yellow-600" },
              { key: "fiber_g", label: "Fiber (g)", color: "text-purple-600" },
            ].map((macro) => (
              <div key={macro.key} className="text-center space-y-2">
                <Label className="text-sm">{macro.label}</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={
                      currentUser.macro_targets[
                        macro.key as keyof typeof currentUser.macro_targets
                      ]
                    }
                    onChange={(e) =>
                      updateNestedField(
                        "macro_targets",
                        macro.key,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="text-center"
                  />
                ) : (
                  <p className={`text-2xl font-bold ${macro.color}`}>
                    {
                      currentUser.macro_targets[
                        macro.key as keyof typeof currentUser.macro_targets
                      ]
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Dietary Restrictions */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Dietary Restrictions</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.priorities.map((priority, index) => (
                <div key={priority} className="flex items-center gap-1">
                  <Badge variant="secondary" className="capitalize">
                    {getDisplayName(priority)}
                  </Badge>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            priorities: editedUser.priorities.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {currentUser.priorities.length === 0 && (
                <p className="text-gray-500 text-sm">No priorities set</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
