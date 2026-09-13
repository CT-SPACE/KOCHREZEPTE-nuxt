<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const FRAME_WIDTH = 300
const FRAME_COUNT = 5
const FRAME_DURATION = 300

const xPos = ref(0)
let interval = null

const startAnimation = () => {
  let frame = 0

  interval = setInterval(() => {
    frame++

    if (frame < FRAME_COUNT) {
      xPos.value = -(frame * FRAME_WIDTH)
    } else {
      frame = 0
      xPos.value = 0
    }
  }, FRAME_DURATION)
}

onMounted(() => startAnimation())
onUnmounted(() => clearInterval(interval))
</script>

<template>
    <div class="loader-container">
  <div
    class="loader"
    :style="{
      '--xPos': `${xPos}px`
    }"
  ></div></div>
</template>

<style scoped>
.loader-container{
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
     transform: scale(0.25);
  transform-origin: center;
}


.loader {
  width: 300px;
  height: 345px;
  background-image: url('/assets/img/loading_pot.png');
  background-repeat: no-repeat;

  /* Jetzt funktioniert es */
  background-position: var(--xPos) 0;
}
</style>
