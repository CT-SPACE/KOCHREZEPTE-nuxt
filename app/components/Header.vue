<template>
  <header>
    <Header_ani />
    <div class="head">
      <h1>Kochrezepte</h1>
      <form class="quick-search" @submit.prevent="handleSubmit">
        <input v-model.trim="query" type="text" placeholder="Rezept, Zutat oder Land suchen..." />
        <button type="submit">Suchen</button>
      </form>
    </div>
  </header>
</template>

<script setup>

const { query, openSearchLayer } = useRecipeSearch()

function handleSubmit() {
  openSearchLayer(query.value)
}
</script>

<style scoped>
header {
  background: 
    /* url('/assets/img/kochbuch_header.png') right -50px bottom -10px no-repeat, */
    radial-gradient(circle at top left, #97c135, rgb(70, 123, 21));
  /* background-size: 500px, cover;*/
  color: white;
  min-height: 120px;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(81, 119, 90, 0.4);
}
.head{
  position:absolute;
  height:100%;
  width:calc(100% - 100px);
  right:100px;
  display:flex;
  z-index:10;
  align-items:center;
  justify-content:space-between;

}

h1 {
  align-self: center;
  text-shadow: 1px 1px 3px rgba(74, 128, 79, 0.8)
  
}

.quick-search {
  display: flex;
  gap: 8px;
}
.quick-search input {
  padding: 8px;
  min-width: 260px;
  width:100%;
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
  .head{
    flex-direction: column;
            justify-content: center;
            padding-left: 100px;
        gap: 0;
  }
  h1{
    margin-bottom: 8px;
  }

  .quick-search {
    flex-direction: column;
  }
}
</style>
