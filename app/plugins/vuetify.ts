//  plugins/vuetify.ts
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VFileUpload } from "vuetify/labs/VFileUpload";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: { mdi },
    },
    components: { VFileUpload },
  });

  nuxtApp.vueApp.use(vuetify);
});
