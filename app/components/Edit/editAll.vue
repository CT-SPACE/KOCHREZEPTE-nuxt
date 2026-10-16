<template>
    <v-card class="recipe-card">
        <v-form ref="formRef" validate-on="submit lazy" v-model="isValid" @submit.prevent="save">

            <v-card class="pa-4" min-width="500">
                <v-card-title>Neues Rezept</v-card-title>

                <!-- <v-select :items="props.sourceTypes" item-title="source_type" item-value="stid" label="Quelle" /> -->
                <v-card-text>
                    <EditRecipeDataRecipeBaseFields v-model="recipe" :source-types="sourceTypes" />
                    <template v-if="isPersonal">
                        <EditRecipeDataRecipeAllFields v-model="recipe" />
                        <v-divider></v-divider>
                        <div class="zubereitung">
                            <EditRecipeDataRecipeIngredientsEditor v-model="ingredients" :units="units"
                                :ingredient-options="ingredientOptions" />
                            <EditRecipeDataPreparationSteps v-model="recipe" />
                        </div>
                    </template>


                </v-card-text>

            </v-card>
        </v-form>
        <v-card-actions class="actions-fixed">
            <v-btn color="primary" type="submit">SAVE</v-btn>
            <v-btn @click="resetRecipe">Clear</v-btn>
            <v-btn @click="cancel()">Cancel</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { DbRecipe, DbSourceType, DbIngredients, DbRecipeIngredients, DbSources, DbUnits } from '../../types/dbRecipe.type'
import { createRecipe } from '../../utils/achdb.service'
import { updateRecipeFull } from '../../utils/achdb.service'
const emit = defineEmits(['close'])
const isValid = ref(false)
const formRef = ref()

// const props = withDefaults(
//     defineProps<{
//         recipe?: DbRecipe,
//         sourceTypes: DbSourceType[]
//         units: DbUnits[]
//         ingredients?: DbIngredients,
//         recipeIngredients?: DbRecipeIngredients,
//         sources?: DbSources,
//         editMode: 'edit' | 'new',
//         ingredientOptions?: { id: number; name: string }[]
//         initialSourceTypeId?: number | null
//     }>(),
//     { ingredientOptions: () => [], initialSourceTypeId: null }
// )
// const propsID = defineProps<{
//     recipe: DbRecipe,
//     sourceTypes: DbSourceType[],
//     units: DbUnits[],
//     ingredients?: DbIngredients,
//     recipeIngredients?: DbRecipeIngredients,
//     sources?: DbSources,
//     editMode: 'edit',
// }>()

const props = withDefaults(
    defineProps<{
        recipe?: DbRecipe | null,
        sourceTypes: DbSourceType[]
        units: DbUnits[]
        ingredients?: DbIngredients,
        recipeIngredients?: DbRecipeIngredients,
        sources?: DbSources,
        editMode: 'edit' | 'new',
        ingredientOptions?: { id: number; name: string }[]
        initialSourceTypeId?: number | null
    }>(),
    { ingredientOptions: () => [], initialSourceTypeId: null }
)

const localRecipe = ref<DbRecipe>(
    props.editMode === 'edit'
        ? structuredClone(toRaw(props.recipe))   // vorhandenes Rezept kopieren
        : {
            id: 0,
            title: '',
            description: '',
            servings: null,
            prep_time: null,
            cook_time: null,
            category: null,
            source: '',
            source_detail: '',
            updated_at: '',
            note: '',
            source_type_id: 0
        }
)
const localRecipeIngredients = ref<DbRecipeIngredients>(
    structuredClone(toRaw(props.recipeIngredients ?? []))
)

const localSources = ref<DbSources>(
    structuredClone(toRaw(props.sources ?? []))
)


const draftKey = getDraftKey(props.recipe.id)


onMounted(() => {
    const draft = localStorage.getItem(draftKey)
    if (!draft) return
    try {
        const parsed = JSON.parse(draft)
        if (parsed.recipe) {
            localRecipe.value = { ...localRecipe.value, ...parsed.recipe, updated_at: props.recipe.updated_at }
        }
        if (parsed.sources) localSources.value = parsed.sources
    } catch {
        console.warn('Draft konnte nicht geladen werden')
    }
})

watch([localRecipe, localSources], () => {
    localStorage.setItem(
        draftKey,
        JSON.stringify({ recipe: localRecipe.value, sources: localSources.value })
    )
}, { deep: true })


const { recipe, ingredients, resetRecipe } = useFormRecipe(props.initialSourceTypeId)

const isPersonal = computed(
    () =>
        props.sourceTypes.find(s => s.stid === recipe.value.source_type_id)?.source_type === 'Persönlich'
)

async function save() {
    const { valid } = await formRef.value.validate()
    if (!valid) return
    if (props.editMode === "edit") {
        await updateRecipeFull(localRecipe.value, localRecipeIngredients.value)
    } else {
        await createRecipe(recipe.value, isPersonal.value ? ingredients.value : [])

    }
    cancel()
}
const rules = useFormRules()

function cancel() {
    resetRecipe()
    emit('close')
}
</script>

<style>
.recipe-card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.actions-fixed {
    width: 100%;
    border-top: 1px solid #ddd;
    padding: 12px 30px;
    display: flex;
    justify-content: flex-end;

}

.actions-fixed button {
    border: 1px solid #f6f6f6
}

.v-divider {
    color: green;
    margin: 5px 10px;
}

.zubereitung {
    margin: 8px 0;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 8px 5px;
}
</style>
