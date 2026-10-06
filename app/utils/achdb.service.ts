import type { DbRecipe, DbRecipeIngredients, DbSourceType, DbUnits } from '../types/dbRecipe.type'

export async function getAllRecipesFromDB(): Promise<DbRecipe[]> {
  const res = await $fetch<DbRecipe[]>('/api/recipes')
  return res
}

export async function getAllSourceTypesFromDB(): Promise<DbSourceType[]> {
  const res = await $fetch<DbSourceType[]>('/api/source_types')
  return res
}

export async function getAllUnitsFromDB(): Promise<DbUnits[]> {
  const res = await $fetch<DbUnits[]>('/api/units')
  return res
}

export async function getAllIngredientsFromDB(): Promise<{ id: number; name: string | null }[]> {
  return await $fetch('/api/ingredients')
}

export async function createRecipe(recipe: DbRecipe, ingredients: DbRecipeIngredients = []) {
  return await $fetch<{ id: number }>('/api/recipes', {
    method: 'POST',
    body: {
      recipe,
      ingredients,
      sources: [
        {
          source: recipe.source,
          source_detail: recipe.source_detail,
          note: recipe.note,
          source_type_id: recipe.source_type_id
        }
      ]
    }
  })
}
