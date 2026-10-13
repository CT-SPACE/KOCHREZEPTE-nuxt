<template>
    <editOverlay id="edit-Flag" v-if="editMode" :units="units" :recipe="selected" :source-types="sourceTypes"
        :ingredient-options="ingredientOptions" :initial-source-type-id="newSourceTypeId" :edit-mode="editMode"
        @close="editMode = null" />
    <v-card title="Achims Datenbank" flat>

    

        <template v-slot:text>
            <v-text-field v-model="search" label="Search" variant="outlined" single-line></v-text-field>
        </template>
        <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="recipes" item-key="id" @click:row="(_e: Event, { item }: { item: DbRecipe }) => openEdit(item)"
            :search="search" :sort-icon="''">
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

        </v-data-table>
    </v-card>
    <div class="newRecipeBtn">
        <v-fab v-if="!editMode" icon="mdi-plus" location="bottom end" absolute offset>
            <v-icon>{{  open ? 'mdi-close' : 'mdi-plus' }}</v-icon>
            <v-speed-dial v-model="open" location="top center" transition="slide-y-reverse-transition"
                activator="parent">
                <v-btn v-for="st in sourceTypes" :key="st.stid" icon size="default" :title="st.source_type"
                    @click="openNew(st.stid)">
                    <v-icon :icon="st.icon ?? 'mdi-file-document-outline'" />
                </v-btn>
            </v-speed-dial>
        </v-fab>
        <!-- <v-fab :active="!editMode" class="ms-4" icon="mdi-plus" location="bottom start" size="small" absolute
            @click="openNew()" offset></v-fab> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { getRecipesFromData, type RecipeData } from '../utils/data.service'
import { getAllSourceTypesFromDB, getAllUnitsFromDB, getAllIngredientsFromDB } from '../utils/achdb.service'
import type { DbRecipe, DbSourceType, DbUnits } from '../types/dbRecipe.type'


const recipes = ref<DbRecipe[]>([])
const sourceTypes = ref<DbSourceType[]>([])
const units = ref<DbUnits[]>([])
const search = ref('')
const editMode = ref<null | 'edit' | 'new'>(null)
const { loading, start, stop } = useLoading()
const selected = ref<DbRecipe | null>(null)
const ingredientOptions = ref<{ id: number; name: string | null }[]>([])
const newSourceTypeId = ref<number | null>(null)

// const sourceIcons: Record<string, string> = {
//     Magazin: 'mdi-newspaper-variant-outline',
//     Buch: 'mdi-book-open-page-variant-outline',
//     Internet: 'mdi-web',
//     'Persönlich': 'mdi-account-heart-outline'
// }

onMounted(async () => {
    start()
    await new Promise(resolve => setTimeout(resolve, 3000))
    units.value = await getAllUnitsFromDB()
    recipes.value = await getAllRecipesFromDB()
    sourceTypes.value = await getAllSourceTypesFromDB()
    ingredientOptions.value = await getAllIngredientsFromDB()

    stop()
})

function openEdit(item: DbRecipe) {
    if (!item) return;
    selected.value = structuredClone(toRaw(item))
    editMode.value = 'edit'
}

// function openNew() {
//     recipes.value = []
//     // sourceTypes.value = sourceTypes.source_type
//     editMode.value = 'new'
// }

function openNew(sourceTypeId: number) {
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
    { key: 'source_type', title: 'Quelle', width: '100px' },
    { key: 'source', title: 'Zu finden in:', width: '100px' },
    { key: 'source_detail', title: 'Wo genau: ', width: '20%' },
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

h2 {
    margin-bottom: 20px;
}
</style>
