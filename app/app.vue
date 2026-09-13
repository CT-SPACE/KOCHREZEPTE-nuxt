<!-- <template>
  <link rel="preload" href="/node_modules/@mdi/font/fonts/materialdesignicons-webfont.woff2"
        as="font" type="font/woff2" crossorigin>

  <v-app>
    
    <div class="headerContainer">
      <Header />
    </div>

    <v-main class="app-main">
      <RecipeSearchOverlay />
      <div class="allRecipes">
        <NuxtPage />
      </div>

      <nav class="footer">
        <NuxtLink to="/">HOME</NuxtLink> |
        <NuxtLink to="/achdb">ACH DB</NuxtLink> |
        <NuxtLink to="/about">ABOUT</NuxtLink>
      </nav>
    </v-main>
  </v-app>
</template> -->

<template>
  <!-- Fonts müssen VOR Vuetify geladen werden -->
  <link
    rel="preload"
    href="/node_modules/@mdi/font/fonts/materialdesignicons-webfont.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <v-app>
    <!-- HEADER MUSS AUSSERHALB V-MAIN SEIN -->
    <div class="headerContainer">
      <Header />
    </div>

    <!-- Vuetify darf ab hier arbeiten -->
    <v-main class="app-main">
      <RecipeSearchOverlay />

      <div class="allRecipes">
        <NuxtPage />
      </div>

      <nav class="footer">
        <NuxtLink to="/">HOME</NuxtLink> |
        <NuxtLink to="/achdb">ACH DB</NuxtLink> |
        <NuxtLink to="/about">ABOUT</NuxtLink>
      </nav>
    </v-main>
  </v-app>
</template>



<script setup>

import '@/main.css'
import Header from '@/components/Header.vue'
import RecipeSearchOverlay from '@/components/RecipeSearchOverlay.vue'

</script>

<style scoped>



nav.footer {
    background: linear-gradient(to right top, rgb(204, 243, 198) 20%, rgb(131, 202, 25) 100%);
    padding: 20px 5px;
    background-color: #f5f5f5;
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0;
    box-sizing: border-box;
}

#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.app-main{
  min-height: 100vh;
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
    min-height:120px;
  height: 120px;
  width: 100%;
  z-index: 100;
}

@media (max-width: 700px) {
  .allRecipes {
    padding-top: 180px;
  }
  .headerContainer{

    height:auto;
  }
}

@media (max-width:400px){
  .allRecipes {
    padding: 180px 10px 100px 10px;
  }
}
</style>
