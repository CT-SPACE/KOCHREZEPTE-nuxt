<template>
  <v-text-field v-model.number="recipe.servings" min="1"
    @keydown="(e: KeyboardEvent) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()" type="number"
    label="Portionen" :rules="[rules.required, rules.positive]" />
  <v-text-field v-model.number="recipe.prep_time" min="1" type="number" label="Vorbereitungszeit (min)"
    @keydown="(e: KeyboardEvent) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()" />
  <v-text-field v-model.number="recipe.cook_time" min="1" type="number" label="Kochzeit (min)"
    @keydown="(e: KeyboardEvent) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()" />

</template>

<script setup lang="ts">
import type { DbRecipe } from '~/types/dbRecipe.type'

const recipe = defineModel<DbRecipe>({ required: true })

const rules = useFormRules()
</script>

<style scoped>
.zutat.menge {
  max-width: 80px !important;

}
</style>
