export interface DbRecipe {
  id: number;
  title: string;
  description: string | null;
  servings: number | null;
  prep_time: number | null;
  cook_time: number | null;
  source: string | null;
  source_detail: string | null;
  note: string | null;
  source_type_id: number;
  // updated_at: string | null
  category: string | null;
}

export interface DbSourceTypes {
  stid: number;
  source_type: string;
  icon: string | null;
}

export type DbSourceType = DbSourceTypes;

export interface DbRecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  amount: number | null;
  unit_id: number | null;
}

export type DbRecipeIngredients = DbRecipeIngredient[];

export interface DbIngredients {
  id: number;
  name: string;
  type: string[];
}

export interface DbSource {
  id: number;
  recipe_id: number;
  source: string;
  source_detail: string;
  note: string;
  source_type_id: number;
}

export type DbSources = DbSource[];

export interface DbUnits {
  id: number;
  name: string;
  abbreviation: string;
}
