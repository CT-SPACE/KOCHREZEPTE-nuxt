<script setup>

import { ref, onMounted } from 'vue'
import { getAllRecipesFromAPI } from '../utils/api.service'

const { loading, start, stop } = useLoading()
const meals = ref([])

onMounted(async () => {
  try {
    start()
    
    const data = await getAllRecipesFromAPI()
   setTimeout(() => {
    meals.value = data?.meals || []
    stop()
    }, 0)
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error)
  }
})
</script>

<template>
     <Loader v-if="loading" />
    
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
