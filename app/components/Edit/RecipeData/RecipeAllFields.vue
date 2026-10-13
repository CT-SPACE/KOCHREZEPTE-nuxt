<template>
  <v-text-field
    v-model.number="recipe.servings"
    type="number"
    label="Portionen"
    :rules="[rules.required, rules.positive]"
  />
  <v-text-field v-model.number="recipe.prep_time" type="number" label="Vorbereitungszeit (min)" />
  <v-text-field v-model.number="recipe.cook_time" type="number" label="Kochzeit (min)" />
  <v-textarea
  v-model="recipe.description"
  rows="3"
  label="Zubereitung"
  auto-grow
/>
</template>

<script setup lang="ts">
import type { DbRecipe } from '~/types/dbRecipe.type'

const recipe = defineModel<DbRecipe>({ required: true })

const rules = useFormRules()
</script>

<style scoped>
.zutat.menge{
  max-width:80px !important;
  
}
</style>
