<template>
  
  <v-form validate-on="submit" ref="formRef" v-model="isValid">

    <v-card>
      <v-card-title>Rezept bearbeiten</v-card-title>
      <div class="formRecipe">

      <!-- <div v-for="(src, i) in localSources" :key="src.id ?? i" class="width50">
          Quelle:

          <v-select v-model="src.source_type_id" :items="sourceTypes" item-title="source_type" item-value="stid"
            label="Quelle" :rules="[rules.required]" />
        </div> -->

        <EditRecipeDataRecipeBaseFields v-model="localRecipe" :source-types="sourceTypes"  />
      </div>
      <div class="btn-position">
        <v-card-actions>
          <v-btn color="primary" @click="save">Speichern</v-btn>
          <v-btn @click="emit('close')">Abbrechen</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-form>

</template>


<script setup lang="ts">

import type { DbRecipe, DbSourceType, DbIngredients, DbRecipeIngredients, DbSources, DbUnits } from '../../types/dbRecipe.type'
const emit = defineEmits(['close'])
const isValid = ref(false)
const formRef = ref()

const props = defineProps<{
  recipe: DbRecipe,
  sourceTypes: DbSourceType[],
  units: DbUnits[],
  ingredients?: DbIngredients,
  recipeIngredients?: DbRecipeIngredients,
  sources?: DbSources,
  editMode: 'edit',
}>()

const localRecipe = ref<DbRecipe>(
  props.editMode === 'edit'
    ? structuredClone(toRaw(props.recipe))   // vorhandenes Rezept kopieren
    : {
      id: 0,
      title: '',
      description: '',
      servings: null,
      prep_time: null,
      cook_time: null,
      category: null,
      source: '',
      source_detail: '',
      updated_at: '',
      note: '',
      source_type_id: 0
    }
)

const localRecipeIngredients = ref<DbRecipeIngredients>(
  structuredClone(toRaw(props.recipeIngredients ?? []))
)

const localSources = ref<DbSources>(
  structuredClone(toRaw(props.sources ?? []))
)


const draftKey = getDraftKey(props.recipe.id)

onMounted(() => {
  const draft = localStorage.getItem(draftKey)
  if (!draft) return
  try {
    const parsed = JSON.parse(draft)
    if (parsed.recipe) {
      // updated_at bleibt immer der gespeicherte DB-Stand
      localRecipe.value = { ...localRecipe.value, ...parsed.recipe, updated_at: props.recipe.updated_at }
    }
    if (parsed.sources) localSources.value = parsed.sources
  } catch {
    console.warn('Draft konnte nicht geladen werden')
  }
})

watch([localRecipe, localSources], () => {
  localStorage.setItem(
    draftKey,
    JSON.stringify({ recipe: localRecipe.value, sources: localSources.value })
  )
}, { deep: true })

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await updateRecipeFull()
  localStorage.removeItem(draftKey)
  emit('close')
}

const getSourceTypeName = (id: number | null) => {
  if (id == null) return ''
  const st = props.sourceTypes.find(s => s.stid === id)
  return st?.source_type ?? ''
}

async function updateRecipeFull() {
  const id = localRecipe.value.id

  const payload = {
    recipe: localRecipe.value,
    ingredients: localRecipeIngredients.value,
    sources: localSources.value
  }

  const res = await $fetch(`/api/recipes/${id}/full`, {
    method: 'PATCH',
    body: payload
  })

  return res
}
const rules = useFormRules()


</script>

<style scoped>
.formRecipe {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-position {
  /* position: absolute;
  bottom: 10px;
  right: 20px; */
  display: flex;
  justify-content: flex-end;

}

.width50{
  width:50%;
  align-self:right;
}
</style>
