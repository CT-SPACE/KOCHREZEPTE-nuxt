<script setup>

import { ref, onMounted } from 'vue'
import { getAllRecipesFromAPI } from '../utils/api.service'
import { getPersonalRecipesFromDB } from '../utils/personal.service'

const { loading, start, stop } = useLoading()
const meals = ref([])
const errors = ref([])

onMounted(async () => {
  start()
  errors.value = []

  try {
    const [apiResult, personalResult] = await Promise.allSettled([
      getAllRecipesFromAPI(),
      getPersonalRecipesFromDB(),
    ])
    const apiMeals = []
    const personalMeals = []

    if (apiResult.status === 'fulfilled') {
      apiMeals.push(...(apiResult.value.meals ?? []))
    } else {
      console.error('Fehler beim Laden der API-Rezepte:', apiResult.reason)
      errors.value.push('Die API-Rezepte konnten nicht geladen werden.')
    }

    if (personalResult.status === 'fulfilled') {
      personalMeals.push(...personalResult.value)
    } else {
      console.error(
        'Fehler beim Laden der Psersönlichen Rezepte:', personalResult.reason,
      )
      errors.value.push('Die persönlichen Rezepte konnten nicht geladen werden.')
    }
    setTimeout(() => {
      meals.value = [...personalMeals, ...apiMeals]
    }, 300)
  } finally {
    stop()
  }
})
</script>

<template>
  <Loader_pot v-if="loading" />
  <div v-for="error in errors" :key="error" role="alert">
    {{ error }}
  </div>

  <div class="recipes">
    <RecipeItem v-for="meal in meals" :key="meal.idMeal" :recipe="meal" />
  </div>
</template>

<style scoped>
.recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
