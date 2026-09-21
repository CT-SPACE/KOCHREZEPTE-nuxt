import type { DbRecipe } from '../types/dbRecipe.type'
import type { DbSourceType } from '../types/dbRecipe.type'

export async function getAllRecipesFromDB(): Promise<DbRecipe[]> {
  const res = await $fetch<DbRecipe[]>('/api/recipes')
  return res
}

export async function getAllSourceTypesFromDB(): Promise<DbSourceType[]> {
  const res = await $fetch<DbSourceType[]>('/api/source_types')
  return res
}


// export async function getRecipesByIdFromAPI(idMeal: string | number): Promise<MealResponse> {
//   const res = await $fetch<MealResponse>(`${API}/lookup.php`, {
//     params: { i: idMeal }
//   });
//   return res;
// }

// export async function getRandomRecipeFromAPI(): Promise<MealResponse> {
//   const res = await $fetch<MealResponse>(`${API}/random.php`);
//   return res;
// }

