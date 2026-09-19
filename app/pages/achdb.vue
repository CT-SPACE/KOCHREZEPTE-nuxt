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
// import { getRecipesFromData, type RecipeData } from '../utils/data.service'
import { getAllRecipesFromDB } from '../utils/achdb.service'
import type { DbRecipe } from '../types/dbRecipe.type'

const recipes = ref<DbRecipe[]>([])
const search = ref('')
const { loading, start, stop } = useLoading()

onMounted(async () => {
    start()
     await new Promise(resolve => setTimeout(resolve, 3000)) 
    recipes.value = await getAllRecipesFromDB()
     stop()
})
const headers = [
    {
        align: 'start',
        key: 'title',
        sortable: true,
        title: 'Gericht',
    },
    { key: 'catagory', title: 'Kategorie' },
    { key: 'source_type', title: 'Zu finden in: ' },
    { key: 'source', title: 'Wo genau: ' },
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