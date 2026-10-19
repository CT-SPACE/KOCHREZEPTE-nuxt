<template>
    <v-card class="recipe-card">
        <v-form ref="formRef" validate-on="submit lazy" v-model="isValid" @submit.prevent="save">

            <v-card class="pa-4" min-width="500">
                <v-card-title>Neues Rezept</v-card-title>

                <!-- <v-select :items="props.sourceTypes" item-title="source_type" item-value="stid" label="Quelle" /> -->
                <v-card-text>
                    <EditRecipeDataRecipeBaseFields v-model="localRecipe" :source-types="sourceTypes" />
                    <template v-if="isPersonal">
                        <EditRecipeDataRecipeAllFields v-model="localRecipe" />
                        <v-divider></v-divider>
                        <div class="zubereitung">
                            <EditRecipeDataRecipeIngredientsEditor v-model="localRecipeIngredients" :units="units"
                                :ingredient-options="ingredientOptions" />
                            <EditRecipeDataPreparationSteps v-model="localRecipe" />
                        </div>
                    </template>


                </v-card-text>

            </v-card>


        </v-form>
        <v-card-actions class="actions-fixed">

            <v-btn @click="resetForm()">Clear</v-btn>
            <v-btn @click="cancel()">Cancel</v-btn>
            <v-btn color="primary" type="submit">SAVE</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { DbRecipe, DbSourceType, DbIngredients, DbRecipeIngredients, DbSources, DbUnits } from '../../types/dbRecipe.type'
import { createRecipe } from '../../utils/achdb.service'
import { updateRecipe } from '../../utils/achdb.service'
const emit = defineEmits(['close'])
const isValid = ref(false)
const formRef = ref()
let discarded = false

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
        initialSourceTypeId?: number
    }>(),
    { ingredientOptions: () => [] }
)

function clearForm(sourceTypeId?: number): DbRecipe {
    const stid = sourceTypeId ?? props.initialSourceTypeId
    if (stid === undefined) {
        throw new Error('editAll: Quelltyp fehlt beim Anlegen eines neuen Rezepts')
    }
    return {
        id: 0,
        title: '',
        description: '',
        servings: null,
        prep_time: null,
        cook_time: null,
        category: null,
        source: '',
        source_detail: '',
        note: '',
        source_type_id: stid
    }
}

function resetForm() {
    localRecipe.value = clearForm(localRecipe.value.source_type_id)
    localRecipeIngredients.value = []
}

const localRecipe = ref<DbRecipe>(
    props.editMode === 'edit' && props.recipe
        ? structuredClone(toRaw(props.recipe))
        : clearForm(props.initialSourceTypeId)
)

const localRecipeIngredients = ref<DbRecipeIngredients>(
    props.editMode === 'edit'
        ? structuredClone(toRaw(props.recipeIngredients ?? [])) : []
)

const localSources = ref<DbSources>(
    props.editMode === 'edit'
        ? structuredClone(toRaw(props.sources ?? [])) : []
)


const draftKey = getDraftKey(
    props.editMode === 'edit' ? props.recipe?.id : null
)


onMounted(() => {
    const draft = localStorage.getItem(draftKey)
    if (!draft) return
    try {
        const parsed = JSON.parse(draft)
        if (parsed.recipe) {
            localRecipe.value = { ...localRecipe.value, ...parsed.recipe }
        }
        if (parsed.sources) localSources.value = parsed.sources
        if (parsed.ingredients) {
            localRecipeIngredients.value = { ...localRecipeIngredients.value, ...parsed.ingredients }
        }
    } catch {
        console.warn('Draft konnte nicht geladen werden')
    }
})

watch([localRecipe, localSources], () => {
    if (discarded) return
    localStorage.setItem(
        draftKey,
        JSON.stringify({ recipe: localRecipe.value, ingredients: localRecipeIngredients.value, sources: localSources.value })
    )
}, { deep: true })



const isPersonal = computed(
    () =>
        props.sourceTypes.find(s => s.stid === localRecipe.value.source_type_id)?.source_type === 'Persönlich'
)

watch(isPersonal, (newVal) => {
    if (newVal) {
        // Titel anpassen, wenn persönlich
        if (!localRecipe.value.title?.startsWith('Persönlich: ')) {
            localRecipe.value.title = `Persönlich: ${localRecipe.value.title || ''}`
        }
    } else {
        // Titel zurücksetzen, wenn nicht persönlich
        if (localRecipe.value.title?.startsWith('Persönlich: ')) {
            localRecipe.value.title = localRecipe.value.title.replace(/^Persönlich:\s*/, '')
        }
    }
})

async function save() {
    const recipeToSave = localRecipe.value
    const ingredientsToSave = localRecipeIngredients.value
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (props.editMode === 'new') {
        await createRecipe(recipeToSave, ingredientsToSave)
    } else {
        await updateRecipe(recipeToSave, ingredientsToSave)
    }
    cancel()

}

const rules = useFormRules()

function cancel() {
    clearForm(props.initialSourceTypeId)
    discarded = true
    localStorage.removeItem(draftKey)
    emit('close')
}
</script>

<style>
.recipe-card {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    width: 80vw;
    box-sizing: border-box;
    height: 100%;
}

.actions-fixed {
    width: 100%;
    position: fixed;
    border-top: 1px solid #ddd;
    padding: 12px 30px !important;
    justify-content: flex-end;
    width: 100%;
    right: 0;
    background-color: yellowgreen;
    bottom: 10px;

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
