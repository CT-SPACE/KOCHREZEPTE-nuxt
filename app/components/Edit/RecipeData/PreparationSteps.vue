<template>

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

</script>
