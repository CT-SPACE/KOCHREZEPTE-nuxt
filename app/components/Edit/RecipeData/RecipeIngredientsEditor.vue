<template>
  <div v-for="(ing, i) in ingredients" :key="i" class="d-flex ga-2 align-center zutaten-row">

    <v-text-field
      v-model.number="ing.amount"
      type="number"
      label="Menge"
      density="compact"
      variant="outlined"
      class="zutat menge"
    />
    <v-select
      v-model="ing.unit_id"
      :items="units"
      item-title="name"
      item-value="id"
      label="Einheit"
      density="compact"
      variant="outlined"
      class="zutat unit"
    /> 
       <v-select
      v-model="ing.ingredient_id"
      :items="ingredientOptions"
      item-title="name"
      item-value="id"
      label="Zutat"
      density="compact"
      variant="outlined"
      class="zutat"
    />
    <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="ingredients.splice(i, 1)" />
  </div>
  <v-btn prepend-icon="mdi-plus" variant="tonal" @click="add">Zutat</v-btn>
</template>

<script setup lang="ts">
import type { DbRecipeIngredients, DbUnits } from '~/types/dbRecipe.type'

const ingredients = defineModel<DbRecipeIngredients>({ required: true })

    defineProps<{
  units: DbUnits[]
  ingredientOptions: { id: number; name: string | null }[]
}>()

function add() {
  ingredients.value.push({ id: 0, recipe_id: 0, ingredient_id: 0 as unknown as number, amount: null, unit_id: null })
}
</script>

<style scoped>

.zutat input{
    background-color: white !important;
}
</style>
