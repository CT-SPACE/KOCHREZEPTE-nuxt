<template>
  <header>
    <h1>Kochrezepte</h1>
    <form class="quick-search" @submit.prevent="handleSubmit">
      <input v-model.trim="query" type="text" placeholder="Rezept, Zutat oder Land suchen..." />
      <button type="submit">Suchen</button>
    </form>
  </header>
</template>

<script setup>
// import { useRecipeSearch } from '../composables/useRecipeSearch'

const { query, openSearchLayer } = useRecipeSearch()

function handleSubmit() {
  openSearchLayer(query.value)
}
</script>

<style scoped>
header {
  background:
    url('/assets/img/kochbuch_header.png') right -50px bottom -10px no-repeat,
    radial-gradient(circle at top left, #93d102, rgb(48, 73, 2));
  background-size: 500px, cover;
  color: white;
  min-height: 120px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  overflow: hidden;
}

h1 {
  align-self: center;
}

.quick-search {
  display: flex;
  gap: 8px;
}
.quick-search input {
  padding: 8px;
  min-width: 260px;
}
.quick-search button {
  padding: 8px 14px;
  cursor: pointer;
}

@media (max-width: 700px) {
  header {
    background-size: 800px, cover;
    background-position: bottom;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .quick-search {
    flex-direction: column;
  }
}
</style>
