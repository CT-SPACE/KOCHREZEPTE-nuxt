<script setup>
import RecipeItem from '@/components/RecipeItem.vue'
import { ref, onMounted } from 'vue'
import { getRecipesFromData } from '../utils/data.service.ts'

const meals = ref(getRecipesFromData())

const query = ref('')
const categoryFilter = ref('')
const ingredientFilter = ref('')

const normalize = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  if (!value) {
    return []
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const category = computed(() => {
  return [
    ...new Set(
      meals.value
        .map((meal) => meal.strCategory)
        .filter(Boolean)
        .sort(),
    ),
  ]
})

const ingredientsList = computed(() => {
  const ingredients = meals.value.flatMap((meal) => toArray(meal.strIngredients))

  return [...new Set(ingredients)].sort()
})

const results = computed(() => {
  const search = normalize(query.value)
  const selectedCategory = normalize(categoryFilter.value)
  const selectedIngredient = normalize(ingredientFilter.value)

  return meals.value.filter((meal) => {
    const mealCategory = normalize(meal.strCategory)
    const mealIngredients = toArray(meal.strIngredients).map(normalize)

    const matchesSearch =
      !search ||
      normalize(meal.strMeal).includes(search) ||
      mealCategory.includes(search) ||
      mealIngredients.some((ingredient) => ingredient.includes(search))

    const matchesCategory = !selectedCategory || mealCategory === selectedCategory

    const matchesIngredient = !selectedIngredient || mealIngredients.includes(selectedIngredient)

    return matchesSearch && matchesCategory && matchesIngredient
  })
})

const hasAnyFilter = computed(() => {
  return Boolean(query.value.trim() || categoryFilter.value || ingredientFilter.value)
})
</script>

<template>
  <section class="ach-db">
    <div class="controls">
      <input
        v-model.trim="query"
        type="search"
        placeholder="Filtere nach Rezept, Kategorie oder Zutat ..."
      />

      <select v-model="categoryFilter">
        <option value="">Alle Kategorien</option>
        <option v-for="cat in category" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>

      <select v-model="ingredientFilter">
        <option value="">Alle Zutaten</option>
        <option v-for="ingredient in ingredientsList" :key="ingredient" :value="ingredient">
          {{ ingredient }}
        </option>
      </select>

      <button
        v-if="hasAnyFilter"
        type="button"
        @click="((query = ''), (categoryFilter = ''), (ingredientFilter = ''))"
      >
        Filter zurücksetzen
      </button>
    </div>

    <p v-if="!hasAnyFilter" class="status">Bitte Suchbegriff eingeben oder einen Filter wählen.</p>

    <p v-else class="count">{{ results.length }} Treffer</p>

    <div v-if="hasAnyFilter" class="recipes">
      <RecipeItem v-for="meal in results" :key="String(meal.idMeal)" :recipe="meal" />
    </div>

    <p v-if="hasAnyFilter && results.length === 0" class="status">Keine Rezepte gefunden.</p>
  </section>
</template>

<style scoped>
.ach-db {
  padding: 1rem;
}


.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

input,
select,
button {
  padding: 0.6rem;
}

.recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.status,
.count {
  text-align: center;
}
</style>
