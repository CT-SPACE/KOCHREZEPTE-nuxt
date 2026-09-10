import recipesData from '../data/ach_db.json'

export interface RecipeData {
  idMeal?: string | number
  strMeal?: string
  strCategory?: string
  strCountry?: string
  strInstructions?: string
  strMealThumb?: string
  description?: string[]
  strIngredients?: string[]
  [key: string]: unknown
}

const recipeList = recipesData as RecipeData[]

export function getRecipesFromData(): RecipeData[] {
  return recipeList
}

export function getRecipeByIdFromData(id: string | number): RecipeData | undefined {
  return recipeList.find((recipe) => String(recipe.idMeal) === String(id))
}

export function searchRecipesFromData(searchTerm: string): RecipeData[] {
  const search = searchTerm.trim().toLowerCase()

  if (!search) {
    return getRecipesFromData()
  }

  return recipeList.filter((recipe) =>
    Object.values(recipe).some((value) =>
      String(value ?? '')
        .toLowerCase()
        .includes(search),
    ),
  )
}
