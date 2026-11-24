<template>
    <v-card class="recipe-card">
        <v-form ref="formRef" id="recipe-form" validate-on="input lazy" v-model="isValid" @submit.prevent="save">

            <v-card class="pa-4">
                <v-card-title>{{ title }}</v-card-title>

                <!-- <v-select :items="props.sourceTypes" item-title="source_type" item-value="stid" label="Quelle" /> -->
                <v-card-text>
                    <EditRecipeDataRecipeBaseFields v-model="localRecipe" :source-types="sourceTypes" />
                    <template v-if="isPersonal">
                        <EditRecipeDataRecipeAllFields v-model="localRecipe" />
                        <v-divider></v-divider>
                        <div class="zubereitung">
                            <EditRecipeDataRecipeIngredientsEditor v-model="localRecipeIngredients" :units="units"
                                :ingredient-options="ingredientOptions" :recipe-ingredients="recipeIngredients" />
                            <EditRecipeDataPreparationSteps v-model="localRecipe" />
                        </div>
                        <div>
                            <EditRecipeDataRecipeImageUpload v-model="selectedImage"
                                v-model:approved-crop="approvedCrop" />
                            <v-btn v-if="approvedCrop" type="button" @click="testImageSizes">
                                Bildgrößen prüfen
                            </v-btn>
                        </div>
                    </template>
                    <v-alert v-if="saveError" type="error" class="mb-3">
                        {{ saveError }}
                    </v-alert>

                </v-card-text>

            </v-card>


        </v-form>
        <v-card-actions class="actions-fixed">

            <v-btn @click="resetForm()">Clear</v-btn>
            <v-btn @click="cancel()">Cancel</v-btn>
            <v-btn color="primary" type="submit" form="recipe-form" :disabled="isValid === false || saving"
                :variant="isValid === false ? 'tonal' : 'elevated'" :loading="saving"
                :prepend-icon="isValid === false ? 'mdi-alert-circle-outline' : undefined">SAVE</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { DbRecipe, DbSourceType, DbIngredients, DbRecipeIngredients, DbSources, DbUnits } from '../../types/dbRecipe.type'
import { createRecipe } from '../../utils/achdb.service'
import { updateRecipe } from '../../utils/achdb.service'
import { createRecipeImageSizes } from '../../utils/recipeimage'
import { uploadRecipeImages } from '../../utils/achdb.service'

const saving = ref(false)
const saveError = ref('')
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved', mode: 'new' | 'edit'): void }>()
const isValid = ref(false)
const formRef = ref()
let discarded = false
const selectedImage = ref<File | null>(null)
const approvedCrop = shallowRef<HTMLCanvasElement | null>(null)
const title = computed(() =>
    props.editMode === 'new' ? 'Neues Rezept' : `Rezept bearbeiten: ${localRecipe.value.title}`
)
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

function hasDraftContent() {
    const r = localRecipe.value
    const others = [r.description, r.category, r.source, r.source_detail, r.note, r.servings, r.prep_time, r.cook_time]
        .some(v => v !== null && v !== undefined && String(v).trim() !== '')
    const hasIngredients = localRecipeIngredients.value.some(i => i.ingredient_id > 0)
    return !!r.title?.trim() && (others || hasIngredients)
}

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
        source_type_id: stid,
        image_key: null,
    }
}

function resetForm() {
    selectedImage.value = null
    approvedCrop.value = null
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
            if (Array.isArray(parsed.ingredients)) localRecipeIngredients.value = parsed.ingredients
        }
    } catch {
        console.warn('Draft konnte nicht geladen werden')
    }
})

watch([localRecipe, localSources, localRecipeIngredients], () => {
    if (discarded) return
    if (!hasDraftContent()) {
        localStorage.removeItem(draftKey)
        return
    }
    localStorage.setItem(
        draftKey,
        JSON.stringify({ recipe: localRecipe.value, ingredients: localRecipeIngredients.value, sources: localSources.value })
    )
}, { deep: true })



const isPersonal = computed(
    () =>
        props.sourceTypes.find(s => s.stid === localRecipe.value.source_type_id)?.source_type === 'Persönlich'
)

watch(isPersonal, (personal) => {
    if (!personal) {
        approvedCrop.value = null
    }
})

// async function save() {
//     const { valid } = await formRef.value.validate()

//     if (!valid) {
//         await nextTick()
//         document.querySelector('.v-input--error')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
//         return
//     }
//     if (!isPersonal.value) { localRecipeIngredients.value = [] }
//     try {

//         const ingredients = localRecipeIngredients.value
//         const sources = localSources.value

//         if (props.editMode === 'new') {
//             await createRecipe(localRecipe.value, ingredients, sources)
//         } else {
//             await updateRecipe(localRecipe.value, ingredients, sources)
//         }
//         emit('saved', props.editMode)
//         cancel();
//     } catch (err) {
//         console.error('Speichern fehlgeschlagen:', err)
//     }

// }

async function save() {
    if (saving.value) return

    saving.value = true
    saveError.value = ''

    try {
        const { valid } = await formRef.value.validate()

        if (!valid) {
            await nextTick()
            document.querySelector('.v-input--error')
                ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
            return
        }

        if (isPersonal.value && selectedImage.value && !approvedCrop.value) {
            saveError.value = 'Bitte bestätige zuerst den Bildausschnitt.'
            return
        }

        const recipe = structuredClone(toRaw(localRecipe.value))
        const ingredients = isPersonal.value
            ? structuredClone(toRaw(localRecipeIngredients.value))
            : []
        const sources = structuredClone(toRaw(localSources.value))

        if (isPersonal.value && approvedCrop.value) {
            const { big, small } = await createRecipeImageSizes(approvedCrop.value)
            const { imageKey } = await uploadRecipeImages(big, small)
            recipe.image_key = imageKey
        }

        if (props.editMode === 'new') {
            await createRecipe(recipe, ingredients, sources)
        } else {
            await updateRecipe(recipe, ingredients, sources)
        }

        emit('saved', props.editMode)
        cancel()
    } catch (error) {
        console.error('Speichern fehlgeschlagen:', error)
        saveError.value =
            'Speichern fehlgeschlagen. Prüfe vor einem erneuten Versuch, ob das Rezept bereits gespeichert wurde.'
    } finally {
        saving.value = false
    }
}

async function testImageSizes() {
    if (!approvedCrop.value) return

    try {
        const { big, small } = await createRecipeImageSizes(approvedCrop.value)

        const bigImage = await createImageBitmap(big)
        const smallImage = await createImageBitmap(small)

        console.log('Groß:', bigImage.width, bigImage.height)
        console.log('Klein:', smallImage.width, smallImage.height)

        bigImage.close()
        smallImage.close()
    } catch (error) {
        console.error('Bildverarbeitung fehlgeschlagen:', error)
        alert(error instanceof Error ? error.message : 'Bildverarbeitung fehlgeschlagen.')
    }
}

function cancel() {
    // clearForm(props.initialSourceTypeId)
    discarded = true
    localStorage.removeItem(draftKey)
    emit('close')
}
</script>

<style>
#recipe-form {
    flex: 1 1 0;
    min-height: 0;
    height: auto;
    max-height: none;
    overflow-y: auto;
}


.v-card.recipe-card {
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 80vw;
    box-sizing: border-box;
    height: 100%;
}

.actions-fixed {
    width: 100%;
    /* position: fixed; */
    position: static;
    flex-shrink: 0;
    border-top: 1px solid #ddd;
    padding: 12px 30px !important;
    justify-content: flex-end;
    width: 100%;
    /* right: 0; bottom: 10px; */
    background-color: yellowgreen;


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

@media screen and (max-width: 450px) {
    #recipe-form .v-card-text {
        padding: 1rem 0;
    }

    .v-card.recipe-card {
        width: 100%;
    }

}
</style>
