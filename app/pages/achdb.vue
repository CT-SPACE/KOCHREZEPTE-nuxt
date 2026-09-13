<template>

    <v-card title="Achims Datenbank" flat>
      
        <template v-slot:text>
          
            <v-text-field v-model="search" label="Search" variant="outlined"
                single-line></v-text-field>
        </template>
       <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="recipes" :search="search" :sort-icon="''"></v-data-table>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecipesFromData, type RecipeData } from '../utils/data.service'

const recipes = ref<RecipeData[]>([])
const search = ref('')
const { loading, start, stop } = useLoading()

onMounted(async () => {
    start()
     await new Promise(resolve => setTimeout(resolve, 3000)) 
    recipes.value = getRecipesFromData()
    stop()
})
const headers = [
    {
        align: 'start',
        key: 'strMeal',
        sortable: true,
        title: 'Gericht',
    },
    { key: 'strCategory', title: 'Kategorie' },
    { key: 'source', title: 'Zu finden in: ' },
] as const


</script>


<style scoped>
.achdbContainer {
    padding: 30px;
}

h2 {
    margin-bottom: 20px;
}
</style>