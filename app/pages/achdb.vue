<template>
    <Transition name="edit-fade">
        <editOverlay id="edit-Flag" v-if="editMode" :units="units" :recipe="selected" :source-types="sourceTypes"
            :ingredient-options="ingredientOptions" :recipe-ingredients="selectedIngredients"
            :initial-source-type-id="newSourceTypeId" :edit-mode="editMode" @close="editMode = null" @saved="onSaved" />
    </Transition>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="center">
        {{ snackbar.text }}
    </v-snackbar>
    <v-card title="Achims Datenbank" flat>



        <template v-slot:text>
            <v-text-field v-model="search" class="achdb-searchbar" label="Search" variant="outlined" single-line>
                <template #append-inner>
                    <v-btn v-if="search" type="button" class="clear-search" aria-label="Suche löschen" min-width="30"
                        @click="search = ''"><v-icon icon="mdi-backspace" size="16"></v-icon></v-btn>
                </template>
            </v-text-field>
        </template>
        <v-progress-linear :indeterminate="openingEdit" :style="{ visibility: openingEdit ? 'visible' : 'hidden' }"
            color="primary" height="2" aria-label="Rezept wird geladen" />
        <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>

        <v-data-table v-else :headers="headers" :items="recipes" item-key="id"
            @click:row="(_e: Event, { item }: { item: DbRecipe }) => openEdit(item)" :search="search" :sort-icon="''">
            <!-- Titel -->
            <template #item.title="{ item }">
                {{ item.title }}
            </template>

            <!-- Kategorie -->
            <template #item.category="{ item }">
                {{ item.category }}
            </template>

            <!-- Source Type -->
            <template #item.source_type="{ item }">
                {{ getSourceTypeName(item.source_type_id) }}
            </template>

            <!-- Source -->
            <template #item.source="{ item }">
                {{ item.source }}
            </template>

            <!-- Source_Detail -->
            <template #item.source_detail="{ item }">
                {{ item.source_detail }}
            </template>

            <!-- Source_Note -->
            <template #item.note="{ item }">
                {{ item.note }}
            </template>

        </v-data-table>
    </v-card>
    <div class="newRecipeBtn">
        <v-fab v-if="!editMode" icon="mdi-plus" location="bottom end" :disabled="openingEdit" absolute offset>
            <v-icon>{{ open ? 'mdi-close' : 'mdi-plus' }}</v-icon>
            <v-speed-dial v-model="open" location="top center" transition="slide-y-reverse-transition"
                activator="parent">
                <v-btn v-for="st in sourceTypes" :key="st.stid" icon size="default" :title="st.source_type"
                    @click="openNew(st.stid)">
                    <v-icon :icon="st.icon ?? 'mdi-file-document-outline'" />
                </v-btn>
            </v-speed-dial>
        </v-fab>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { getRecipesFromData, type RecipeData } from '../utils/data.service'
import { getAllSourceTypesFromDB, getRecipeIngredientsFromDB, getAllUnitsFromDB, getAllRecipesFromDB, getAllIngredientsFromDB } from '../utils/achdb.service'
import type { DbRecipe, DbSourceType, DbUnits, DbRecipeIngredients } from '../types/dbRecipe.type'

const selectedIngredients = ref<DbRecipeIngredients>([])
const recipes = ref<DbRecipe[]>([])
const sourceTypes = ref<DbSourceType[]>([])
const units = ref<DbUnits[]>([])
const search = ref('')
const editMode = ref<null | 'edit' | 'new'>(null)
const openingEdit = ref(false)
const { loading, start, stop } = useLoading()
const selected = ref<DbRecipe | null>(null)
const ingredientOptions = ref<{ id: number; name: string }[]>([])
const newSourceTypeId = ref<number>()
const snackbar = reactive({ show: false, text: '', color: 'success' })


async function loadRecipesTableValues() {

    recipes.value = await getAllRecipesFromDB()
    ingredientOptions.value = await getAllIngredientsFromDB()



}
async function onSaved(mode: 'new' | 'edit') {
    try {
        // throw new Error('Test')
        await loadRecipesTableValues()
        snackbar.text = mode === 'new' ? 'Rezept wurde angelegt.' : 'Änderungen wurden gespeichert.'
        snackbar.show = true
        snackbar.color = "success"

    } catch (e) {
        snackbar.color = 'error'
        snackbar.text = 'Rezept konnte nicht vollständig geladen werden.'
        snackbar.show = true
    }
}

onMounted(async () => {
    start()
    await new Promise(resolve => setTimeout(resolve, 3000))
    units.value = await getAllUnitsFromDB()
    await loadRecipesTableValues()
    sourceTypes.value = await getAllSourceTypesFromDB()
    stop()
})



async function openEdit(item: DbRecipe) {
    if (!item || openingEdit.value) return;
    openingEdit.value = true
    try {
        const ingredients = await getRecipeIngredientsFromDB(item.id)
        selected.value = structuredClone(toRaw(item))
        selectedIngredients.value = ingredients
        editMode.value = 'edit'
    } catch (error) {
        console.error('Zutaten konnten nicht geladen werden:', error)
        snackbar.color = 'error'
        snackbar.text = 'Das Rezept konnte nicht geöffnet werden.'
        snackbar.show = true
    } finally {
        openingEdit.value = false
    }
}

function openNew(sourceTypeId: number) {
    if (openingEdit.value) return
    selected.value = null
    newSourceTypeId.value = sourceTypeId
    open.value = false
    editMode.value = 'new'
}

const getSourceTypeName = (id: number) => {
    const st = sourceTypes.value.find(s => s.stid === id)
    return st ? st.source_type : ''
}


const headers = [
    {
        align: 'start',
        key: 'title',
        sortable: true,
        title: 'Gericht',
        width: '30%'
    },
    { key: 'category', title: 'Kategorie', width: '100px' },
    { key: 'note', title: 'Notiz: ', width: '20%' },
    { key: 'source_type', title: 'Quelle', width: '100px' },
    { key: 'source', title: 'Zu finden in:', width: '100px' },
    { key: 'source_detail', title: 'Wo genau: ', width: '100px' },

] as const

import { shallowRef, watch } from 'vue'

const open = shallowRef(false)
const fabPosition = shallowRef('absolute')
const menuLocation = shallowRef('left center')
const fabLocation = shallowRef('right bottom')
const transition = shallowRef('slide-y-reverse-transition')

watch(menuLocation, reopen)
watch(transition, reopen)
watch(fabLocation, () => (open.value = false))
watch(fabPosition, () => (open.value = false))

function reopen() {
    open.value = false
    setTimeout(() => (open.value = true), 400)
}

</script>


<style scoped>
.achdbContainer {
    padding: 30px;
}

.newRecipeBtn {
    width: 40px;
    position: fixed;
    bottom: 60px;
    height: 40px;
    right: 50px;
    z-index: 110;
}

.searchbar input {
    border: none !important;
}

.clear-search {
    padding: 4px 8px;
    border: 0 !important;
    background: transparent;
    color: #333;
    box-shadow: none;
}

.clear-search:hover {
    box-shadow: none;
}

h2 {
    margin-bottom: 20px;
}

.edit-fade-enter-active,
.edit-fade-leave-active {
    transition: opacity 300ms ease-in;
}

.edit-fade-enter-from,
.edit-fade-leave-to {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

    .edit-fade-enter-active,
    .edit-fade-leave-active {
        transition: none;
    }
}
</style>
