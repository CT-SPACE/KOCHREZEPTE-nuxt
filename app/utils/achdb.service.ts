import type {
  DbRecipe,
  DbRecipeIngredients,
  DbSources,
  DbSourceType,
  DbUnits,
} from "../types/dbRecipe.type";

export async function getAllRecipesFromDB(): Promise<DbRecipe[]> {
  const res = await $fetch<DbRecipe[]>("/api/recipes");
  return res;
}

export async function getAllIngredientsFromDB(): Promise<
  { id: number; name: string }[]
> {
  return await $fetch<{ id: number; name: string }[]>("/api/ingredients");
}

export async function getRecipeIngredientsFromDB(
  id: number,
): Promise<DbRecipeIngredients> {
  return await $fetch<DbRecipeIngredients>(
    `/api/recipes/${id}/recipe-ingredients`,
  );
}

export async function getAllSourceTypesFromDB(): Promise<DbSourceType[]> {
  const res = await $fetch<DbSourceType[]>("/api/source_types");
  return res;
}

export async function getAllUnitsFromDB(): Promise<DbUnits[]> {
  const res = await $fetch<DbUnits[]>("/api/units");
  return res;
}

export async function createIngredientInDB(
  name: string,
): Promise<{ id: number; name: string }> {
  return await $fetch<{ id: number; name: string }>("/api/ingredients", {
    method: "POST",
    body: { name },
  });
}

function buildRecipePayload(
  recipe: DbRecipe,
  ingredients: DbRecipeIngredients = [],
  sources: DbSources,
) {
  return {
    recipe,
    ingredients,
    sources: [
      {
        source: recipe.source,
        source_detail: recipe.source_detail,
        note: recipe.note,
        source_type_id: recipe.source_type_id,
      },
    ],
  };
}

export async function createRecipe(
  recipe: DbRecipe,
  ingredients: DbRecipeIngredients = [],
  sources: DbSources,
) {
  console.log("/api/recipes");
  return await $fetch<{ id: number }>("/api/recipes", {
    method: "POST",
    body: buildRecipePayload(recipe, ingredients, sources),
  });
}

export async function updateRecipe(
  recipe: DbRecipe,
  ingredients: DbRecipeIngredients = [],
  sources: DbSources,
) {
  return await $fetch<{ id: number }>(`/api/recipes/${recipe.id}`, {
    method: "PATCH",
    body: buildRecipePayload(recipe, ingredients, sources),
  });
}
