<template>
  <v-card title="Nutrition" flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="ph"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="recipes"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
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
    {key: 'strCategory', title: 'Kategorie' },
    {key: 'source', title: 'Zu finden in: '},
]  as const
</script>