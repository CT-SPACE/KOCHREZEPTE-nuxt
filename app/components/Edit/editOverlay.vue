<template>
  <div class="layer">
    <div class="close-btn"><v-btn icon="$close" variant="text" density="compact" @click="$emit('close')" /></div>
    <EditAll v-if="editMode === 'edit' && props.recipe" :recipe="props.recipe" :units="props.units"
      :source-types="props.sourceTypes" :ingredient-options="ingredientOptions"
      :recipe-ingredients="props.recipeIngredients" :sources="props.sources" edit-mode="edit" @close="$emit('close')"
      @saved="(m) => $emit('saved', m)" />

    <EditAll v-if="editMode === 'new'" :source-types="sourceTypes" :units="units"
      :ingredient-options="ingredientOptions" :initial-source-type-id="initialSourceTypeId" edit-mode="new"
      @close="$emit('close')" @saved="(m) => $emit('saved', m)" />
  </div>


</template>

<script setup lang="ts">
import type { DbRecipe, DbSourceType, DbRecipeIngredients, DbSources, DbIngredients, DbUnits } from '../../types/dbRecipe.type'
// import editTableRowData from './editTableRowData.vue'
// import editNewRecipeData from './editNewRecipeData.vue';


const props = defineProps<{
  recipe?: DbRecipe | null
  recipeIngredients?: DbRecipeIngredients
  sources?: DbSources
  ingredients?: DbIngredients
  ingredientOptions?: { id: number; name: string }[]
  initialSourceTypeId?: number
  sourceTypes: DbSourceType[]
  units: DbUnits[]
  editMode: 'edit' | 'new'
}>()

defineEmits(['close', 'saved'])


</script>


<style scoped>
button {
  border: none;
}

.layer {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 12vh 10vh;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;


}

@media screen and (max-width: 450px) {
  .layer {
    padding: 10dvh 2dvh 4dvh;
  }
}
</style>
