interface MealResponse {
  meals?: any[];
  [key: string]: unknown;
}

const API = 'https://www.themealdb.com/api/json/v1/1';

export async function searchRecipesFromAPI(query: string): Promise<MealResponse> {
  const res = await $fetch<MealResponse>(`${API}/search.php`, {
    params: { s: query }
  });
  return res;
}

export async function getRecipesByIdFromAPI(idMeal: string | number): Promise<MealResponse> {
  const res = await $fetch<MealResponse>(`${API}/lookup.php`, {
    params: { i: idMeal }
  });
  return res;
}

export async function getRandomRecipeFromAPI(): Promise<MealResponse> {
  const res = await $fetch<MealResponse>(`${API}/random.php`);
  return res;
}

export async function getAllRecipesFromAPI(): Promise<MealResponse> {
  const res = await $fetch<MealResponse>(`${API}/search.php`, {
    params: { s: '' }
  });
  return {
    ...res,
    meals: res.meals ? res.meals.slice(0, 20) : []
  };
}