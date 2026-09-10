
const API = 'https://www.themealdb.com/api/json/v1/1'

const isOpen = ref(false)
const query = ref('')
const countryFilter = ref('')
const categoryFilter = ref('')
const ingredientFilter = ref('')

const countries = ref([])
const categories = ref([])
const ingredientsList = ref([])

const results = ref([])
const loading = ref(false)
const listsLoaded = ref(false)

let debounceTimer = null

const hasAnyFilter = computed(
    () =>
        !!query.value ||
        !!countryFilter.value ||
        !!categoryFilter.value ||
        !!ingredientFilter.value
)

async function fetchJson(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fehler beim Laden: ${url}`)
    return res.json()
}

async function loadLists() {
    if (listsLoaded.value) return
    try {
        const [catData, areaData, ingrData] = await Promise.all([
            fetchJson(`${API}/list.php?c=list`),
            fetchJson(`${API}/list.php?a=list`),
            fetchJson(`${API}/list.php?i=list`),
        ])

        categories.value = (catData.meals || [])
            .map((m) => m.strCategory)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))

        countries.value = (areaData.meals || [])
            .map((m) => m.strCountry)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))

        ingredientsList.value = (ingrData.meals || [])
            .map((m) => m.strIngredient)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))

        listsLoaded.value = true
    } catch (err) {
        console.error(err)
    }
}

function intersectByIdMeal(lists) {
    if (lists.length === 0) return []
    if (lists.length === 1) return lists[0]

    return lists.reduce((acc, list) => {
        const ids = new Set(list.map((m) => m.idMeal))
        return acc.filter((m) => ids.has(m.idMeal))
    })
}

async function enrichWithDetails(meals) {
    const detailed = await Promise.all(
        meals.map((m) => fetchJson(`${API}/lookup.php?i=${m.idMeal}`))
    )
    return detailed.map((d) => d.meals?.[0]).filter(Boolean)
}

async function performSearch() {
    if (!hasAnyFilter.value) {
        results.value = []
        return
    }

    loading.value = true

    try {
        const requests = []
        let searchUsed = false

        if (query.value) {
            searchUsed = true
            requests.push(
                fetchJson(`${API}/search.php?s=${encodeURIComponent(query.value)}`)
            )
        }
        if (countryFilter.value) {
            requests.push(
                fetchJson(`${API}/filter.php?a=${encodeURIComponent(countryFilter.value)}`)
            )
        }
        if (categoryFilter.value) {
            requests.push(
                fetchJson(`${API}/filter.php?c=${encodeURIComponent(categoryFilter.value)}`)
            )
        }
        if (ingredientFilter.value) {
            requests.push(
                fetchJson(`${API}/filter.php?i=${encodeURIComponent(ingredientFilter.value)}`)
            )
        }

        const responses = await Promise.all(requests)
        const lists = responses.map((r) => r.meals || [])
        const intersected = intersectByIdMeal(lists)

        results.value =
            searchUsed && requests.length === 1
                ? intersected
                : await enrichWithDetails(intersected)
    } catch (err) {
        console.error(err)
        results.value = []
    } finally {
        loading.value = false
    }
}

function scheduleSearch() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(performSearch, 300)
}

function openSearchLayer(initialQuery) {
    if (typeof initialQuery === 'string') {
        query.value = initialQuery
    }
    isOpen.value = true
    loadLists()
    scheduleSearch()
}

function closeSearchLayer() {
    isOpen.value = false
    resetFilters()
}

function resetFilters() {
    query.value = ''
    countryFilter.value = ''
    categoryFilter.value = ''
    ingredientFilter.value = ''
    results.value = []
    clearTimeout(debounceTimer)
}

export function useRecipeSearch() {
    return {
        isOpen,
        query,
        countryFilter,
        categoryFilter,
        ingredientFilter,
        countries,
        categories,
        ingredientsList,
        results,
        loading,
        hasAnyFilter,
        openSearchLayer,
        closeSearchLayer,
        scheduleSearch,
        resetFilters,
    }
}