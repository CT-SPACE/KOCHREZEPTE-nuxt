<template>
  <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="save">

    <v-card class="pa-4" min-width="500">
      <v-card-title>Neues Rezept</v-card-title>

      <v-select :items="props.sourceTypes" item-title="source_type" item-value="stid" label="Quelle" />
      <v-card-text>
        <EditRecipeDataRecipeBaseFields v-model="recipe" :source-types="sourceTypes" />
        <template v-if="isPersonal">
          <EditRecipeDataRecipeAllFields v-model="recipe" />
          <EditRecipeDataRecipeIngredientsEditor v-model="ingredients" :units="units"
            :ingredient-options="ingredientOptions" />
        </template>


      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit">Speichern</v-btn>
        <v-btn @click="resetRecipe">Leeren</v-btn>
        <v-btn @click="emit('close')">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
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
    ingredientOptions?: { id: number; name: string | null }[]
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
  resetRecipe()
  emit('close')
}
</script>
