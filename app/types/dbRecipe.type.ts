export interface DbRecipe {
  id: number
  title: string
  description: string | null
  servings: number | null
  prep_time: number | null
  cook_time: number | null
  source: string | null
  source_detail: string | null
  note: string | null
  source_type_id: number
  category: string | null
}

export interface DbSourceType {
  stid: number
  source_type: string
}