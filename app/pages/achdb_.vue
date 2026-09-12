<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecipesFromData, type RecipeData } from '../utils/data.service'


const recipes = ref<RecipeData[]>([])
const search = ref('')

onMounted(() => {
  recipes.value = getRecipesFromData()
  console.log(
    'recipes:',
    recipes.value,
    'length: ',
    recipes.value.length,
    '1.Object: ',
    recipes.value[0],
  )
})

const headers = [
  {
    align: 'start',
    key: 'strMeal',
    sortable: true,
    title: 'Gericht',
  },
  {
    key: 'strCategory',
    title: 'Kategorie',
  },
  {
    key: 'source',
    title: 'Quelle',
  },
] as const
</script>

<template>
  <v-card title="Achims Datenbank" flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details="auto"
        detals-active="true"
        single-line
      ></v-text-field>
    </template>

    <v-data-table :headers="headers" :items="recipes" :search="search"></v-data-table>
  </v-card>
</template>

<style scoped>
.achdbContainer {
  padding: 30px;
}
h2 {
  margin-bottom: 20px;
}

.v-text-field{
  background-color: linen;
  border-radius:6px;
}


.v-icon,
.v-pagination__first,

.v-pagination__navigation,
.v-btn--variant-plain,
.v-pagination__navigation .v-btn,
.v-pagination__navigation .v-icon {
  color: black !important;
  opacity: 1 !important;
  fill: currentColor !important;
}
</style>
