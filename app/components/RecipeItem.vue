<template>
  <div class="recipe-item-container">
    <div class="recipe-item" @click="openDetail">
      <img :src="props.recipe?.strMealThumb" class="recipe-img" />
    </div>
    <div class="pad16 teaserText">
      <div class="font12">
        <strong>{{ props.recipe?.strMeal }}</strong>
      </div>
      <div class="subText">{{ props.recipe?.strCategory }} – {{ props.recipe?.strCountry }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRecipeDetails } from '@/composables/useRecipeDetails';

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})

const { openRecipe } = useRecipeDetails()

function openDetail() {
  openRecipe(props.recipe?.idMeal)
}
</script>

<style scoped>
.recipe-item-container {
  border: 1px solid #9e9e9e;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1;
  max-width: 250px;
  width: 18vw;
  text-align: left;
  position: relative;
  padding: 0;
  box-sizing: border-box;
}

.recipe-item-container:hover {
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4);
  scale: 1.02;
  cursor: pointer;
}

.recipe-item {
  overflow: hidden;
  object-fit: cover;
  object-position: bottom;
  margin: 0;
}

.teaserText {
  box-sizing: border-box;
  max-height: 80%;
  height: fit-content;
  font-size: smaller;
  position: absolute;
  width: 100%;
  bottom: 0;
  color: white;
  background-color: #00000080;
}

.subText {
  line-height: 1;
}

.recipe-img {
  max-width: 120%;

  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

@media (min-width: 701px) and (max-width: 1200px) {
  .pad16 {
    padding: 5px 16px;
  }
  .font12 {
    font-size: 1rem;
  }
}

@media (max-width: 700px) {
  .recipe-item {
    height: auto;
    aspect-ratio: 21/9;
    width: 100%;
    min-height: 100px;
    max-height: 130px;
  }
  .recipe-img {
    border-radius: 8px;
  }
  .recipe-item-container {
    aspect-ratio: unset;
    width: 100%;
    max-width: unset;
  }
  .teaserText {
    line-height: 1;
  }
  .pad16 {
    padding: 8px;
  }
}

@media (max-width: 450px) {
  .pad16 {
    padding: 5px 8px;
  }
}
</style>
