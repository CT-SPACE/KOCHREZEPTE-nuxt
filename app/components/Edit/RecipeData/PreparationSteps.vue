<template>
<div class="d-flex flex-column ga-2 stepRow">
   <div v-for="(step, index) in steps" :key="index" class="d-flex ga-2 align-start"> 
    <v-textarea
      :model-value="step"
  rows="3"
  :label="`Step ${index + 1}`"
  auto-grow
  @update:model-value="value => updateStep(index, value)"
/> <v-btn v-if="steps.length > 1" icon="mdi-close" variant="text" density="compact" size="1rem"  @click="removeStep(index)" />
</div>
<v-btn prepend-icon="mdi-plus" variant="tonal" @click="addStep" class="zub-btn">Step hinzufügen</v-btn>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DbRecipe } from '~/types/dbRecipe.type'

const recipe = defineModel<DbRecipe>({ required: true })
const SEPARATOR = '\n---\n'
    const steps = computed(() => (recipe.value.description ?? '').split(SEPARATOR))

function updateStep(index: number, value: string) {
    const updatedSteps = [...steps.value]
    updatedSteps[index] = value
    recipe.value.description = updatedSteps.join(SEPARATOR)
}

function addStep(){
    recipe.value.description = [...steps.value, ''].join(SEPARATOR)
}

function removeStep(index: number) {
  const updatedSteps = steps.value.filter((_, i) => i !== index)
  recipe.value.description = updatedSteps.join(SEPARATOR)
}

</script>

<style>


</style>
