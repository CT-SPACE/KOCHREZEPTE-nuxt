// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: { transpile: ['vuetify'] },
  vite: {
    plugins: [vuetify({ autoImport: true })],
  },
  modules: ['@unocss/nuxt'],
  
})
