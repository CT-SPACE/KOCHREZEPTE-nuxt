<template>
  <div v-if="isOpen" class="overlay">
    <div class="overlay-backdrop" @click="closeSearchLayer"></div>

    <section class="overlay-panel">
      <button class="close-btn" type="button" @click="closeSearchLayer">✕ Schließen</button>

      <h2>Rezeptsuche</h2>

      <div class="controls">
        <input
          v-model.trim="query"
          type="text"
          placeholder="Suche nach Rezept, Zutat, Land oder Kategorie..."
        />

        <select v-model="countryFilter">
          <option value="">Alle Länder</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="categoryFilter">
          <option value="">Alle Kategorien</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select v-model="ingredientFilter">
          <option value="">Alle Zutaten</option>
          <option v-for="i in ingredientsList" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>

      <p v-if="loading" class="status">Lade...</p>
      <p v-else-if="!hasAnyFilter" class="status">Bitte Suchbegriff eingeben oder Filter wählen.</p>
      <p v-else class="count">{{ results.length }} Treffer</p>

      <ul class="teaser-list">
        <li v-for="recipe in results" :key="recipe.idMeal" class="list-item">
          <RecipeItem :recipe="recipe" variant="list" @click="closeSearchLayer" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import RecipeItem from './RecipeItem.vue'
import { useRecipeSearch } from '../composables/useRecipeSearch'

const {
  isOpen,
  query,
  countryFilter,
  categoryFilter,
  ingredientFilter,
  countries,
  categories,
  ingredientsList,
  results,
  loading,
  hasAnyFilter,
  closeSearchLayer,
  scheduleSearch,
} = useRecipeSearch()

watch([query, countryFilter, categoryFilter, ingredientFilter], scheduleSearch)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.overlay-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
.overlay-panel {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 5vh;
  max-width: 1000px;
  width: 92%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: none;
  cursor: pointer;
}

.close-btn:hover {
  border: 1px solid lightgray;
  scale: 1.02;
}
.controls {
  display: flex;
  box-sizing: border-box;
  gap: 8px;
  margin-top: 12px;
}
.controls input,
.controls select {
  padding: 8px;
}

.status,
.count {
  margin: 12px 0;
  font-size: 0.95rem;
  color: #555;
}

select {
  width: 120px;
}
.teaser-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

@media screen and (max-width: 700px) {
  .list-item {
    width: 100%;
  }
}
</style>
