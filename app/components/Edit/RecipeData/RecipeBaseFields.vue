<template>
      <v-select
    v-model="recipe.source_type_id"
    :items="sourceTypes"
    item-title="source_type"
    item-value="stid"
    label="Quelle"
    :rules="[rules.required]"
    class="quelle">
<template #item="{ props: itemProps, item }">
    <v-list-item v-bind="itemProps" :prepend-icon="item.raw.icon ?? 'mdi-help-circle-outline'" />
</template>
<template #selection="{ item }">
    <v-icon :icon="item.raw.icon ?? 'mdi-help-circle-outline'" class="mr-2" />
    {{  item.title }}
</template>
</v-select>

  <v-text-field
    v-model="recipe.title"
    label="Gericht"
    :rules="[rules.required, rules.minLength(3)]"
  />
  <v-text-field v-model="recipe.category" label="Kategorie" />

  <v-text-field v-model="recipe.source" label="Zu finden in:" />
  <v-text-field v-model="recipe.source_detail" label="Wo genau:" />
</template>

<script setup lang="ts">
import type { DbRecipe, DbSourceType } from '~/types/dbRecipe.type'

const recipe = defineModel<DbRecipe>({ required: true })
const props = defineProps<{ sourceTypes: DbSourceType[] }>()

const rules = useFormRules()
</script>

<style scoped>


</style>
