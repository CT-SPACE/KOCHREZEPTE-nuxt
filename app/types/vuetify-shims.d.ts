// Vuetify's package.json exports do not declare TypeScript types for its
// CSS/Sass entry points. This shim tells TypeScript to treat these
// side-effect imports as valid modules so no build/editor errors occur.
declare module 'vuetify/styles'
declare module 'vuetify/styles/*'
