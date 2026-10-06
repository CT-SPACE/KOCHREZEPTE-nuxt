<template>
       <v-form validate-on="submit" ref="formRef" v-model="isValid">
        <!-- <v-text-field
      v-model="localRecipe.title"
      :counter="10"
      label="Gericht"
      :rules="[rules.required, rules.minLength]"
    ></v-text-field> -->
   
   <div> <v-text-field
      v-model="localRecipe.servings"
      :counter="3"
      type="number"
      label="Menge"
    ></v-text-field>
      <v-text-field
      v-model="localRecipe.prep_time"
      maxlength="4"
      type="number"
      label="Vorbereitungszeit"
    ></v-text-field>
        <v-text-field
      v-model="localRecipe.cook_time"
      maxlength="4"
      type="number"
      label="Kochzeit"
    ></v-text-field>
</div>
<!-- // Ingredient-Container // -->
<div  v-for="block in blocks"
      :key="block.id"
      class="my-4 pa-4 border"
    >
    <div v-for="(ring, i) in localRecipeIngredients" :key="i">
       <v-text-field
      v-model="ring.amount"
      maxlength="4"
      type="number"
      label="Menge"
    ></v-text-field>
<v-select
  v-model="ring.unit_id"
  :items="props.units"
  item-title="name"
  item-value="id"
  label="Einheit"
  density="compact"
  variant="outlined"
  hide-details
/>
  </div>
  </div>
    <v-fab
          class="ms-4"
          color="cyan-accent-2"
          icon="mdi-plus"
          location="bottom left"
          size="40"
          absolute
          offset
          @click="addBlock"
        ></v-fab>

    <v-text-field
      v-model="localRecipe.description"
      :counter="5"
      label="Zubereitung"
    ></v-text-field>
    </v-form>
</template>

<script>

const recipe = defineModel<DbRecipe>({ required: true })



</script>