// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
   css: [
    'vuetify/styles',
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false},
  build: { transpile: ['vuetify'] },
  vite: {
    plugins: [vuetify({ autoImport: true })],
  },
  //   nitro: {
  //   preset: 'cloudflare-pages',
  //   modules: ['nitro-cloudflare-dev'],
  // },
  nitro: {
    preset: 'cloudflare-module',
    modules: ['nitro-cloudflare-dev'],
    
  },

  modules: ['@unocss/nuxt'],
  
})
