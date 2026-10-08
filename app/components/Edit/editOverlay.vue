

<template>
  <div class="layer">
         <div class="close-btn"><v-btn icon="$close" variant="text" density="compact" @click="$emit('close')" /></div>
    <editTableRowData
    v-if="editMode === 'edit' && props.recipe"
    :recipe="props.recipe"
    :units="props.units"
    :sourceTypes="props.sourceTypes"
    :recipeIngredients="props.recipeIngredients"
    :sources="props.sources"
    edit-mode="edit"
    @close="$emit('close')"
    />

    <editNewRecipeData
            v-if="editMode === 'new'"
    :source-types="sourceTypes"
    :units="units"
    :ingredient-options="ingredientOptions"
    :initial-source-type-id="initialSourceTypeId"
    @close="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import type { DbRecipe, DbSourceType, DbRecipeIngredients, DbSources, DbIngredients, DbUnits } from '../../types/dbRecipe.type'
import editTableRowData from './editTableRowData.vue'
import editNewRecipeData from './editNewRecipeData.vue';


const props = defineProps<{
  recipe?: DbRecipe | null
  recipeIngredients?: DbRecipeIngredients
  sources?: DbSources
  ingredients?: DbIngredients
  ingredientOptions?: { id: number; name: string | null }[]
  initialSourceTypeId?: number | null
  sourceTypes: DbSourceType[]
  units: DbUnits[]
  editMode: 'edit' | 'new' | null
}>()

defineEmits(['close'])


</script>


<style scoped>
.layer {
  background-color: rgba(45, 90, 45, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 10vw;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;


}

.close-btn{
  position: absolute;
    top: 30px;
    right: 10vw !important;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  
}
</style>
