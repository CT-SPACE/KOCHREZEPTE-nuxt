import type { DbRecipe } from "../types/dbRecipe.type";

export const PERSONAL_LABEL = "Persönlich";
const PLACEHOLDER_IMG = "/assets/img/placeholder.svg";
export const MOBILE_PLACEHOLDER_IMG = "/assets/img/placeholder_small.svg";

// Form wie TheMealDB, damit RecipeItem/[id].vue unverändert funktionieren
export interface PersonalMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strCountry: string;
  strMealThumb: string;
  strInstructions?: string;
  ingredientNames?: string[];
  [key: string]: unknown; // strIngredientN / strMeasureN
}

// Antwort von /api/recipes?personal=1 (Zutatennamen als Komma-Liste)
type PersonalListRow = Pick<DbRecipe, "id" | "title" | "category"> & {
  ingredient_names: string | null;
};

// Antwort von /api/recipes/[id]
interface PersonalDetailRow extends Pick<
  DbRecipe,
  "id" | "title" | "description" | "category"
> {
  ingredients: { name: string; amount: number | null; unit: string | null }[];
}

function baseMeal(
  r: Pick<DbRecipe, "id" | "title" | "category">,
): PersonalMeal {
  return {
    idMeal: `db-${r.id}`,
    strMeal: r.title,
    strCategory: r.category,
    strCountry: PERSONAL_LABEL,
    strMealThumb: PLACEHOLDER_IMG,
  };
}

export function isPersonalId(id: string | number): boolean {
  return String(id).startsWith("db-");
}

export async function getPersonalRecipesFromDB(): Promise<PersonalMeal[]> {
  const rows = await $fetch<PersonalListRow[]>("/api/recipes", {
    params: { personal: 1 },
  });

  // recipes.get.ts liefert pro Quelle eine Zeile -> nach id deduplizieren
  const unique = new Map<number, PersonalListRow>();
  rows.forEach((r) => unique.set(r.id, r));

  return [...unique.values()].map((r) => ({
    ...baseMeal(r),
    ingredientNames: r.ingredient_names
      ? r.ingredient_names.split(",").map((n) => n.trim())
      : [],
  }));
}

export async function getPersonalRecipeByIdFromDB(
  idMeal: string | number,
): Promise<PersonalMeal> {
  const id = Number(String(idMeal).replace(/^db-/, ""));
  const r = await $fetch<PersonalDetailRow>(`/api/recipes/${id}`);

  const meal: PersonalMeal = {
    ...baseMeal(r),
    strInstructions: r.description ?? "",
    ingredientNames: r.ingredients.map((i) => i.name),
  };

  // auf strIngredientN / strMeasureN (max. 20) mappen, wie [id].vue sie liest
  r.ingredients.slice(0, 20).forEach((i, idx) => {
    const n = idx + 1;
    meal[`strIngredient${n}`] = i.name;
    meal[`strMeasure${n}`] = [i.amount, i.unit].filter(Boolean).join(" ");
  });

  return meal;
}

// Schritte in description sind mit "---" getrennt
export function splitPersonalSteps(description: string): string[] {
  return description
    .split(/^\s*---\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean);
}
