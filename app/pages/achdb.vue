<template>

    <v-card title="Achims Datenbank" flat>

        <template v-slot:append>
            <v-btn
                :color="isEditing ? 'success' : 'primary'"
                :prepend-icon="isEditing ? 'mdi-lock-open-variant' : 'mdi-lock'"
                variant="tonal"
                @click="isEditing = !isEditing"
            >
                {{ isEditing ? 'Bearbeiten aktiv' : 'Bearbeiten' }}
            </v-btn>
        </template>

        <template v-slot:text>
          
            <v-text-field v-model="search" label="Search" variant="outlined"
                single-line></v-text-field>
        </template>
       <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="recipes" item-key="id" class="elevation-1" :search="search" :sort-icon="''">
  <!-- Titel -->
  <template #item.title="{ item }">
    <v-text-field
      v-model="item.title"
      :readonly="!isEditing"
      density="compact"
      variant="outlined"
      hide-details
    />
  </template>

  <!-- Kategorie -->
  <template #item.category="{ item }">
    <v-text-field
      v-model="item.category"
      :readonly="!isEditing"
      density="compact"
      variant="outlined"
      hide-details
    />
  </template>

  <!-- Source Type -->
  <template #item.source_type="{ item }">
      <v-select
    :items="sourceTypes"
    item-title="source_type"
    item-value="stid"
    v-model="item.source_type_id"
    :readonly="!isEditing"
    density="compact"
    variant="outlined"
    hide-details
  />
  </template>

  <!-- Source -->
  <template #item.source="{ item }">
    <v-text-field
      v-model="item.source"
      :readonly="!isEditing"
      density="compact"
      variant="outlined"
      hide-details
    />
  </template>

  <!-- Source_Detail -->

  <!-- Source -->
  <template #item.source_detail="{ item }">
    <v-text-field
      v-model="item.source_detail"
      :readonly="!isEditing"
      density="compact"
      variant="outlined"
      hide-details
    />
  </template>

        </v-data-table>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { getRecipesFromData, type RecipeData } from '../utils/data.service'
import { getAllRecipesFromDB } from '../utils/achdb.service'
import { getAllSourceTypesFromDB } from '../utils/achdb.service'
import type { DbRecipe } from '../types/dbRecipe.type'
import type { DbSourceType } from '../types/dbRecipe.type'


const recipes = ref<DbRecipe[]>([])
const sourceTypes = ref<DbSourceType[]>([])
const search = ref('')
const isEditing = ref(false)
const { loading, start, stop } = useLoading()


onMounted(async () => {
    start()
     await new Promise(resolve => setTimeout(resolve, 3000)) 
    recipes.value = await getAllRecipesFromDB()
    sourceTypes.value = await getAllSourceTypesFromDB()
     stop()
})

const headers = [
    {
        align: 'start',
        key: 'title',
        sortable: true,
        title: 'Gericht',
        width: '30%' 
    },
    { key: 'category', title: 'Kategorie', width:'100px' },
    { key: 'source_type', title: 'Quelle', width: '100px' },
    { key: 'source', title: 'Zu finden in:' , width: '200px'},
    { key: 'source_detail', title: 'Wo genau: ', width: '100px' },
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