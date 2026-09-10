<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getRecipesByIdFromAPI } from '../utils/api.service'

const route = useRoute()
const meal = ref<any>(null)

// Null-safe Helper-Funktionen
const getIngredient = (mealData: any, n: string | number) => {
  const ing = mealData?.[`strIngredient${n}`]
  return ing && ing.trim() !== '' ? ing : null
}

const getMeasure = (mealData: any, m: string | number) => {
  const meal = mealData?.[`strMeasure${m}`]
  return meal && meal.trim() !== '' ? meal : ''
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const data = await getRecipesByIdFromAPI(id)

    // Prüfen, ob meals vorhanden sind
    if (data && data.meals && data.meals.length > 0) {
      meal.value = data.meals[0]
    }
  } catch (error) {
    console.error('Fehler beim Laden des Rezepts:', error)
  }
})


function splitIntoParagraphs(text: string, sentencesPerParagraph = 3): string[] {
  const sentences = text
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const paragraphs: string[] = []
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(' '))
  }

  return paragraphs.length > 0 ? paragraphs : [text]
}

const instructionSteps = computed(() => {
  if (!meal.value || !meal.value.strInstructions) return []
  const text = meal.value.strInstructions.trim()

  const parts = text.split(/(?:step\s+(\d+))|(?:\.\s+(\d+)\s+)/i)

  const steps: { number: string; paragraphs: string[] }[] = []

  // Text vor dem ersten Treffer separat behandeln (das ist meistens "Step 1")
  const leadingText = parts[0]?.trim()
  if (leadingText) {
    steps.push({ number: '1', paragraphs: splitIntoParagraphs(leadingText, 3) })
  }

  for (let i = 1; i < parts.length; i += 3) {
    const stepNumber = parts[i] ?? parts[i + 1]
    const stepText = parts[i + 2]?.trim()
    if (stepNumber && stepText) {
      steps.push({ number: stepNumber, paragraphs: splitIntoParagraphs(stepText, 3) })
    }
  }

  if (steps.length === 0 && text.length > 0) {
    steps.push({ number: '1', paragraphs: splitIntoParagraphs(text, 3) })
  }

  return steps
})
</script>

<template>
  <div v-if="meal" class="pad16">
    <h2 class="pad16">{{ meal.strMeal }}</h2>
    <div class="hero-image-container">
      <img :src="meal.strMealThumb" :alt="meal.strMeal" class="hero-image" />
    </div>
    <div class="pad16">
      <span><strong>Kategorie:</strong> {{ meal.strCategory }}</span
      >&nbsp;|&nbsp;
      <span><strong>Land:</strong> {{ meal.strCountry }}</span>
    </div>
    <div class="pad16 borderContainer">
      <h3>Zutaten</h3>
      <ul class="list">
        <template v-for="n in 20" :key="n">
          <li v-if="getIngredient(meal, n)">
            <span v-if="getMeasure(meal, n)">{{ getMeasure(meal, n) }}</span
            >&nbsp; {{ getIngredient(meal, n) }}
          </li>
        </template>
      </ul>
    </div>
    <div class="pad16 borderContainer">
      <h3>Zubereitung</h3>
      <ol class="list">
        <!--    <li v-for="steps in instructionSteps" :key="steps.number">
          <strong>Step {{ steps.number }}:</strong><br />
          {{ steps.text }}
          <p></p>
        </li> -->
        <li v-for="steps in instructionSteps" :key="steps.number">
          <strong>Step {{ steps.number }}:</strong>
          <p v-for="(paragraph, index) in steps.paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </li>
      </ol>
    </div>
  </div>
  <div v-else>
    <p>Rezept wird geladen...</p>
  </div>
</template>

<style scoped>
.hero-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
  height: 20vw;
  min-height: 130px;
  max-height: 200px;
  overflow: hidden;
  max-height: 300px;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.hero-image {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  object-position: center;
}

.borderContainer {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
}

.list {
  list-style-type: none;
  padding: 16px;
  text-align: left;
  margin: 0;
}

li p {
  margin-top: 0;
}
</style>
