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


    <v-combobox
      :model-value="getIngredient(ing.ingredient_id)"
      :items="ingredientOptions"
      item-title="name"
      item-value="id"
      label="Zutat"
      density="compact"
      variant="outlined"
      class="zutat"
      :loading="loadingId === i"
      @update:model-value="(val) => onSelectIngredient(ing, val, i)"
    >
      <template #no-data>
        <v-list-item>
          <v-list-item-title class="text-caption">
            Enter drücken, um neue Zutat zu übernehmen
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-combobox>
    <v-btn v-if="ingredients.length > 1" icon="mdi-close" variant="text" density="compact" size="20" @click="ingredients.splice(i, 1)" />
  </div>
 <v-btn  prepend-icon="mdi-plus" variant="tonal" @click="add" class="zub-btn">Zutat</v-btn>
</template>

<script setup lang="ts">
import type { DbRecipeIngredient, DbRecipeIngredients, DbUnits } from '~/types/dbRecipe.type'
import { createIngredientInDB } from '~/utils/achdb.service'

const ingredients = defineModel<DbRecipeIngredients>({ required: true })

    const props = defineProps<{
  units: DbUnits[]
  ingredientOptions: { id: number; name: string }[]
}>()

const loadingId = ref<number | null>(null)

function getIngredient(id: number | null) {
  if (!id) return null
  return props.ingredientOptions.find(opt => opt.id === id) ?? null
}

async function onSelectIngredient(
  ing: DbRecipeIngredient,
  val: string | { id: number; name: string } | null,
  index: number
) {
  if (!val) {
    ing.ingredient_id = 0
    return
  }

  // Bereits vorhandene Zutat aus Dropdown ausgewählt
  if (typeof val === 'object' && 'id' in val) {
    ing.ingredient_id = val.id
    return
  }

  // Neuer Text eingegeben
  const trimmed = val.trim()
  if (!trimmed) {
    ing.ingredient_id = 0
    return
  }

  // Prüfen, ob der Name lokal schon existiert
  const match = props.ingredientOptions.find(
    opt => opt.name.toLowerCase() === trimmed.toLowerCase()
  )
  if (match) {
    ing.ingredient_id = match.id
    return
  }

  // Neue Zutat direkt in DB anlegen
  loadingId.value = index
  try {
    const created = await createIngredientInDB(trimmed)
    props.ingredientOptions.push(created)
    ing.ingredient_id = created.id
  } catch (err) {
    console.error('Fehler beim Anlegen der Zutat:', err)
  } finally {
    loadingId.value = null
  }
}

function add() {
  ingredients.value.push({
    id: 0,
    recipe_id: 0,
    ingredient_id: 0,
    amount: null,
    unit_id: null
  })
}
</script>

<style scoped>
.zutaten-row{
  margin-top:4px;
}
.zutat input{
    background-color: white !important;
}
</style>
