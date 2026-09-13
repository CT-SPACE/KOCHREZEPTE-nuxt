<template>
  <ClientOnly>
    <CustomCursor />
    <CursorTrail />
  </ClientOnly>
    <div class="about-container">
       <h2 class="width100">About:</h2> 
<p>Für meine Bewerbung beim FWU habe ich eine kleine Kochrezepte-App in NUXT/Vue/JavaScript gebaut.</p>
<p>Ich hatte einfach Lust, etwas Praktisches umzusetzen. Es hat mir Spaß gemacht, die App innerhalb einer Woche von der Idee bis zur funktionierenden Anwendung zu entwickeln.
</p>
<p>
  Ich habe vuetify und unocss kennengelernt. Und mit Hilfe von Ki auch einbinden können. Es gibt da noch eine Unschärfe, die ich noch verstehen muss.
</p>
<p>Mir ging es darum, die Zeit bis ich wieder von euch höre, sinnvoll zu nutzen, und mir selbst zu zeigen wie schnell man Neues umsetzen kann. Diese Freude am Ausprobieren ist unbezahlbar.
</p>
Christina Troitzsch
</div>
</template>
<script setup>
</script>

<style scoped>
.width100{
  width:100%;
}
.about-container {
    padding: 16px;
    display:flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 16px;
}
</style>