import { defineConfig, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        mdi: async () => (await import('@iconify-json/mdi/icons.json')).default,
      }
    })
  ]
})
