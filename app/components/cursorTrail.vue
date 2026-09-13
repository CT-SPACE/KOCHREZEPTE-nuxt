
<script setup>
import { onMounted, onUnmounted } from 'vue'

const modules = import.meta.glob('/assets/icons/*.svg', { eager: true,  import: 'default' })
const icons = Object.values(modules)
console.log('icons: ', icons)

// const icons = [
//   '/assets/icons/fish-plate.svg',
//   '/assets/icons/pancakes.svg',
//   '/assets/icons/cup.svg',
//   '/assets/icons/salad.svg'
// ]

// const modules = import.meta.glob('/public/assets/icons/*.svg', { eager: true })

// // Pfade extrahieren
// const icons = Object.keys(modules).map(path => {
//   // /public/icons/pot.svg → /icons/pot.svg
//   return path.replace('/public', '')
// })

let lastX = null
let lastY = null

// const MIN_DIST = 80     // Mindestabstand
// const MAX_DIST = 120    // Maximalabstand

const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

const createTrailItem = (x, y) => {
  const el = document.createElement('img')
  el.src = icons[Math.floor(Math.random() * icons.length)]
  el.style.position = 'fixed'
  el.style.left = x + 'px'
  el.style.top = y + 'px'
  el.style.width = '60px'
  el.style.height = '60px'
  el.style.pointerEvents = 'none'
  el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`
  el.style.opacity = '1'
  el.style.transition = 'opacity 0.9s ease-out'

  document.body.appendChild(el)

  setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 1800)
  }, 1550)
}

const MIN_DIST = 80

const onMove = (e) => {
  const x = e.clientX
  const y = e.clientY

  if (lastX === null) {
    lastX = x
    lastY = y
    return
  }

  const dist = distance(lastX, lastY, x, y)

  if (dist > MIN_DIST) {
    createTrailItem(x, y)
    lastX = x
    lastY = y
  }
}


onMounted(() => window.addEventListener('mousemove', onMove))
onUnmounted(() => window.removeEventListener('mousemove', onMove))
</script>

<template></template>
