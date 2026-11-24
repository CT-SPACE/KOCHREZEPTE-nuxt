<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getRecipesByIdFromAPI } from '../utils/api.service'
import type { RecipeAPIDetail } from '../utils/api.service'
import {
  isPersonalId, MOBILE_PLACEHOLDER_IMG, splitPersonalSteps
} from '../utils/personal.service'

interface InstructionStep {
  number: string
  paragraphs: string[]
}

const { loading, start, stop } = useLoading()

const route = useRoute()
const meal = ref<any>(null)
const errorMessage = ref('')

// Null-safe Helper-Funktionen
const getIngredient = (mealData: any, n: string | number) => {
  const ing = mealData?.[`strIngredient${n}`]
  return typeof ing === 'string' && ing.trim() !== '' ? ing : null
}

function getMeasure(mealData: RecipeAPIDetail, n: number): string {
  const measure = mealData[`strMeasure${n}`]
  return typeof measure === 'string' ? measure.trim() : ''
}

onMounted(() => {
  watch(
    () => route.params.id,
    async (id, _previousId, onCleanup) => {
      let active = true

      onCleanup(() => {
        active = false
      })

      meal.value = null
      errorMessage.value = ''
      start()

      try {
        if (typeof id !== 'string' || !id) {
          throw new Error('Ungültige Rezept-ID.')
        }

        let recipe: RecipeAPIDetail | null

        if (isPersonalId(id)) {
          if (!/^db-[1-9]\d*$/.test(id)) {
            throw new Error('Ungültige persönliche Rezept-ID.')
          }

          recipe = await getPersonalRecipeByIdFromDB(id)
        } else {
          const data = await getRecipesByIdFromAPI(id)
          recipe = data.meals?.[0] ?? null
        }

        if (!active) return

        if (!recipe) {
          errorMessage.value = 'Das Rezept wurde nicht gefunden.'
          return
        }

        meal.value = recipe
      } catch (error) {
        if (!active) return

        console.error('Fehler beim Laden des Rezepts:', error)
        errorMessage.value = 'Das Rezept konnte nicht geladen werden.'
      } finally {
        if (active) stop()
      }
    },
    { immediate: true },
  )
})


function splitIntoParagraphs(text: string, sentencesPerParagraph = 3): string[] {
  const sentences = text
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?])\s+|▢/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const paragraphs: string[] = []
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(' '))
  }

  return paragraphs.length > 0 ? paragraphs : [text]
}

const instructionSteps = computed<InstructionStep[]>(() => {

  const text = meal.value?.strInstructions?.trim()
  if (!text || !meal.value) return []

  if (isPersonalId(meal.value.idMeal)) {
    return splitPersonalSteps(text).map((step, index) => ({
      number: String(index + 1),
      paragraphs: [step],
    }))
  }
  const parts = text.split(/(?:step\s+(\d+))|(?:\.\s+(\d+)\s+)/i)

  const steps: InstructionStep[] = []

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
  <Loader_pot v-if="loading" />
  <div class="recipe-close">
    <div class="close-btn"> <v-btn to="/" icon="$close" variant="text" density="compact"
        aria-label="Rezept schließen" /></div>
  </div>
  <div v-if="meal">
    <h2 class="pad16">{{ meal.strMeal }}</h2>
    <div class="hero-image-container">
      <!-- <img :src="meal.strMealThumb" :alt="meal.strMeal" class="hero-image" /> -->
      <picture>
        <source v-if="isPersonalId(meal.idMeal)" media="(width < 400px)"
          :srcset="meal.strMealThumbSmall ?? MOBILE_PLACEHOLDER_IMG" />
        <img :src="meal.strMealThumb" :alt="meal.strMeal" class="hero-image" />
      </picture>
    </div>
    <div class="pad16 center">
      <span>{{ meal.strCategory }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <span>{{ meal.strCountry }}</span><br>
      <span v-if="isPersonalId(meal.idMeal) && meal.strPrepTime > 0">
        <img src="/assets/img/cutting-board.svg" class="icons" alt="Preperation Time"></img> {{
          meal.strPrepTime
        }}&nbsp;min&nbsp;&nbsp;
      </span>
      <span v-if="isPersonalId(meal.idMeal) && meal.strCookTime > 0"><img src="/assets/img/cooking-food.svg"
          class="icons" alt="Cooking Time"></img>&nbsp;{{ meal.strCookTime
          }}&nbsp;min</span>
    </div>
    <div class="pad16 borderContainer">
      <h3>Zutaten</h3>
      <ul class="list">
        <template v-for="n in 20" :key="n">
          <li v-if="getIngredient(meal, n)">
            <span v-if="getMeasure(meal, n)">{{ getMeasure(meal, n) }}</span>&nbsp; {{ getIngredient(meal, n) }}
          </li>
        </template>
      </ul>
    </div>
    <div class="pad16 borderContainer">
      <h3>Zubereitung</h3>
      <ol class="list">
        <li v-for="steps in instructionSteps" :key="steps.number">
          <strong>Step {{ steps.number }}:</strong>
          <p v-for="(paragraph, index) in steps.paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </li>
      </ol>
    </div>
  </div>
  <div v-else-if="errorMessage" class="pad16" role="alert">
    {{ errorMessage }}
  </div>
</template>

<style scoped>
.hero-image-container {
  display: flex;
  justify-content: center;

  width: 100%;
  height: 20vw;
  min-height: 130px;
  max-height: 200px;
  overflow: hidden;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

picture {
  width: 100%;
  display: flex;
}

span {
  font-size: 0.8rem;
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

.center {
  text-align: center;
}

.recipe-close {
  top: 20px;
  opacity: 0.8;
  position: relative;
  display: flex;
  justify-content: end;
}

.recipe-close:hover {
  color: black;
  opacity: 1;
}

li p {
  margin-top: 0;
  margin-bottom: 8px;
  white-space: pre-line;
}

.icons {
  margin-left: 5px;
  margin-right: 3px;
}
</style>
