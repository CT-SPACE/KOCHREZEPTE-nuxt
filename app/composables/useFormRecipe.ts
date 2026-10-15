import type { DbRecipe, DbRecipeIngredients, DbSourceTypes } from '~/types/dbRecipe.type'

// Ein Entwurf pro Rezept-ID; ohne ID (neues Rezept) gilt der Basis-Schlüssel
export const getDraftKey = (id?: number | null) =>
  id ? `recipeDraft:${id}` : 'recipeDraft'

const DRAFT_KEY = getDraftKey()

const emptyRecipe = (): DbRecipe => ({
  id: 0,
  title: '',
  description: '',
  servings: null,
  prep_time: null,
  cook_time: null,
  category: null,
  source: '',
  source_detail: '',
  updated_at: '',
  note: '',
  source_type_id: 0
})

export function useFormRecipe(initialSourceTypeId?: number | null) {
  const recipe = ref<DbRecipe>(emptyRecipe())
  const ingredients = ref<DbRecipeIngredients>([])

  let skipDraftHandling = false

  function resetRecipe() {
    
    skipDraftHandling = true
    const currentSourceTypeId = recipe.value.source_type_id
    recipe.value = { ...emptyRecipe(), source_type_id: currentSourceTypeId }
    ingredients.value = []
    localStorage.removeItem(DRAFT_KEY)
  }

  function addIngredient() {
    ingredients.value.push({ id: 0, recipe_id: 0, ingredient_id: 0, amount: null, unit_id: null })
  }

  function removeIngredient(index: number) {
    ingredients.value.splice(index, 1)
  }

  onMounted(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (parsed.recipe) recipe.value = parsed.recipe
        if (parsed.ingredients) ingredients.value = parsed.ingredients
      } catch {
        console.warn('Draft konnte nicht geladen werden')
      }
    }
    if (initialSourceTypeId) recipe.value.source_type_id = initialSourceTypeId
  })

  watch(
    [recipe, ingredients],
    () => {
      if (skipDraftHandling) { skipDraftHandling = false; return }
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ recipe: recipe.value, ingredients: ingredients.value })
      )
    },
    { deep: true }
  )

  return { recipe, ingredients, resetRecipe, addIngredient, removeIngredient }
}
