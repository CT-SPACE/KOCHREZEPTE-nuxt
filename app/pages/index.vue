<script setup>

import { ref, onMounted } from 'vue'
import { getAllRecipesFromAPI } from '../utils/api.service'
import { getPersonalRecipesFromDB, MOBILE_PLACEHOLDER_IMG } from '../utils/personal.service'

const itemsPerPage = 28
const page = useState('recipe-list-page', () => 1)
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


const totalPages = computed(() => Math.ceil(meals.value.length / itemsPerPage))
const paginatedMeals = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return meals.value.slice(startIndex, endIndex)
})
</script>

<template>
  <Loader_pot v-if="loading" />
  <div v-for="error in errors" :key="error" role="alert">
    {{ error }}
  </div>

  <div class="recipes">
    <RecipeItem v-for="meal in paginatedMeals" :key="meal.idMeal" :recipe="meal" />
  </div>

  <div class="text-center">
    <v-container>
      <v-row class="justify-center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination v-model="page" :length="totalPages" class="my-4" rounded="circle"></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
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
