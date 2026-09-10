<template>
  <v-app>
    <div class="headerContainer"><Header /></div>
    <RecipeSearchOverlay />
    <div class="allRecipes"><NuxtPage /></div>

    <nav class="footer">
      <NuxtLink to="/">HOME</NuxtLink>  |
      <NuxtLink to="/achdb">ACH DB</NuxtLink> | <NuxtLink to="/about">ABOUT</NuxtLink>
    </nav>
  </v-app>
</template>

<script setup>
import '@/main.css'
import Header from '@/components/Header.vue'
import RecipeSearchOverlay from '@/components/RecipeSearchOverlay.vue'

</script>

<style scoped>
nav.footer {
  /* opacity: 0.8; */
  background: linear-gradient(
    to right top,

    rgb(204, 243, 198) 20%,
    rgb(131, 202, 25) 100%
  );
  padding: 30px;
  background-color: #f5f5f5;
}
#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

.allRecipes {
  padding: 130px 30px 100px 30px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 #f5f5f5;
}

.headerContainer {
  position: fixed;
  height: 120px;
  width: 100%;
  z-index: 100;
}

@media (max-width: 700px) {
  .allRecipes {
    padding-top: 180px;
  }
}

@media (max-width:400px){
  .allRecipes {
    padding: 180px 0 0px 0;
  }
}
</style>
