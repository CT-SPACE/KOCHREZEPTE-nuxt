<template>
  <v-card class="recipe-card">
  <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="save">

    <v-card class="pa-4" min-width="500">
      <v-card-title>Neues Rezept</v-card-title>

      <!-- <v-select :items="props.sourceTypes" item-title="source_type" item-value="stid" label="Quelle" /> -->
      <v-card-text>
        <EditRecipeDataRecipeBaseFields v-model="recipe" :source-types="sourceTypes" />
        <template v-if="isPersonal">
          <EditRecipeDataRecipeAllFields v-model="recipe" />
          <v-divider></v-divider>
          <div class="zubereitung">
          <EditRecipeDataRecipeIngredientsEditor v-model="ingredients" :units="units"
            :ingredient-options="ingredientOptions" />
          <EditRecipeDataPreparationSteps v-model="recipe" />
          </div>
        </template>


      </v-card-text>

    </v-card>
  </v-form>
          <v-card-actions class="actions-fixed">
        <v-btn color="primary" type="submit">SAVE</v-btn>
        <v-btn @click="resetRecipe">Clear</v-btn>
        <v-btn @click="cancel()">Cancel</v-btn>
      </v-card-actions>
      </v-card>
</template>

<script setup lang="ts">
import type { DbSourceType, DbUnits } from '../../types/dbRecipe.type'
import { createRecipe } from '../../utils/achdb.service'

const emit = defineEmits(['close'])
const formRef = ref()

const props = withDefaults(
  defineProps<{
    sourceTypes: DbSourceType[]
    units: DbUnits[]
    ingredientOptions?: { id: number; name: string }[]
    initialSourceTypeId?: number | null
  }>(),
  { ingredientOptions: () => [], initialSourceTypeId: null }
)

const { recipe, ingredients, resetRecipe } = useFormRecipe(props.initialSourceTypeId)

const isPersonal = computed(
  () =>
    props.sourceTypes.find(s => s.stid === recipe.value.source_type_id)?.source_type === 'Persönlich'
)

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  await createRecipe(recipe.value, isPersonal.value ? ingredients.value : [])
  cancel()
}

function cancel(){
  resetRecipe()
  emit('close')
}
</script>

<style>
.recipe-card {
  display: flex;
  flex-direction: column;
  height: 100%; 
}

.actions-fixed{
    width:100%;
    border-top: 1px solid #ddd;
  padding: 12px 30px;
  display: flex;
  justify-content: flex-end;

}

.actions-fixed button {
  border: 1px solid #f6f6f6
}

.v-divider{
  color: green;
  margin: 5px 10px;
}

.zubereitung{
  margin: 8px 0;
  border: 1px solid gray ;
  border-radius: 10px;
  padding: 8px 5px;
}
</style>
