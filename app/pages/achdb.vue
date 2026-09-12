<template>
  <v-card title="Achims Datenbank" flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="recipes"
      :search="search"
      :sort-icon="''"
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


<style scoped>
.achdbContainer {
  padding: 30px;
}
h2 {
  margin-bottom: 20px;
}


</style>