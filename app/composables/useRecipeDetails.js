export function useRecipeDetails() {
  const router = useRouter()

  function openRecipe(id) {
    router.push(`/${id}`)
  }

  function closeRecipe() {
    router.back()
  }

  return { openRecipe, closeRecipe }
}