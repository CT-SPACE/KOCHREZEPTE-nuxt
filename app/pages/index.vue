<script setup>

import { ref, onMounted } from 'vue'
import { getAllRecipesFromAPI } from '../utils/api.service'


const meals = ref([])

onMounted(async () => {
  try {
    const data = await getAllRecipesFromAPI()
    meals.value = data?.meals || []
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error)
  }
})
</script>

<template>
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
