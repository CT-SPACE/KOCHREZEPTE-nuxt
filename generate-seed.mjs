import { readFileSync, writeFileSync } from 'node:fs'

const jsonPath = './app/data/ach_db.JSON'
const raw = readFileSync(jsonPath, 'utf-8')
const data = JSON.parse(raw)

// Existing seed.sql already inserts:
//   source_types: 1 Kochbuch, 2 Website  -> we add 3 Magazin
//   recipes: 1 Spaghetti Bolognese, 2 Gemüsecurry -> JSON recipes start at id 3
//   ingredients: 1 Spaghetti, 2 Hackfleisch, 3 Kokosmilch, 4 Tomaten -> new ones continue after existing + JSON-unique ones
const RECIPE_ID_START = 3
const SOURCE_TYPE_ID_MAGAZIN = 3
const EXISTING_INGREDIENT_NAMES = ['Spaghetti', 'Hackfleisch', 'Kokosmilch', 'Tomaten']

function sqlEscape(value) {
  return String(value).replace(/'/g, "''")
}

function sqlValue(value) {
  if (value === null || value === undefined || value === '') return 'NULL'
  return `'${sqlEscape(value)}'`
}

// Trennt z.B. "Beef 5 / S. 156" in ["Beef 5", "S. 156"].
// Fällt auf [rawSource, null] zurück, wenn kein "S." (Seitenangabe) gefunden wird.
function splitSource(rawSource) {
  if (!rawSource) return [rawSource, null]
  const match = rawSource.match(/^(.*?)\s*\/?\s*(S\.\s*.*)$/)
  if (!match) return [rawSource, null]
  const source = match[1].trim()
  const detail = match[2].trim()
  return [source || rawSource, detail]
}

function joinNonEmpty(arr) {
  if (!Array.isArray(arr)) return ''
  return arr.map((s) => (s ?? '').trim()).filter(Boolean).join(', ')
}

// Build ingredient dictionary: name -> id (case-sensitive match on trimmed name)
const ingredientIdByName = new Map()
let nextIngredientId = EXISTING_INGREDIENT_NAMES.length + 1
for (const name of EXISTING_INGREDIENT_NAMES) {
  ingredientIdByName.set(name, ingredientIdByName.size + 1)
}

const recipeLines = []
const sourceLines = []
const recipeIngredientLines = []
const newIngredientNames = []

data.forEach((item, index) => {
  const recipeId = RECIPE_ID_START + index
  const title = (item.strMeal ?? '').trim()
  const description = joinNonEmpty(item.description)
  const category = (item.strCategory ?? '').trim()

  recipeLines.push(
    `  (${sqlValue(title)}, ${sqlValue(description)}, NULL, NULL, NULL, ${sqlValue(category)})`
  )

  const rawSource = (item.source ?? '').trim()
  const [sourcePart, detailPart] = splitSource(rawSource)
  const note = (item.notes ?? '').trim()
  sourceLines.push(
    `  (${recipeId}, ${sqlValue(sourcePart)}, ${sqlValue(detailPart)}, ${sqlValue(note)}, ${SOURCE_TYPE_ID_MAGAZIN})`
  )

  const ingredients = Array.isArray(item.strIngredients)
    ? item.strIngredients.map((s) => (s ?? '').trim()).filter(Boolean)
    : []

  for (const ingredientName of ingredients) {
    if (!ingredientIdByName.has(ingredientName)) {
      ingredientIdByName.set(ingredientName, nextIngredientId)
      newIngredientNames.push(ingredientName)
      nextIngredientId++
    }
    const ingredientId = ingredientIdByName.get(ingredientName)
    recipeIngredientLines.push(`  (${recipeId}, ${ingredientId}, NULL, NULL)`)
  }
})

const newIngredientLines = newIngredientNames.map(
  (name) => `  (${sqlValue(name)}, NULL)`
)

const sql = `
-- Importierte Rezepte aus app/data/ach_db.JSON
-- Generiert mit generate-seed.mjs

INSERT INTO source_types (source_type) VALUES
  ('Magazin');

INSERT INTO recipes (title, description, servings, prep_time, cook_time, category) VALUES
${recipeLines.join(',\n')};

INSERT INTO sources (recipe_id, source, source_detail, note, source_type_id) VALUES
${sourceLines.join(',\n')};

INSERT INTO ingredients (name, type) VALUES
${newIngredientLines.join(',\n')};

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
${recipeIngredientLines.join(',\n')};
`

writeFileSync('./migrations/seed.preview.sql', sql)
console.log(`Vorschau geschrieben: migrations/seed.preview.sql`)
console.log(`${data.length} Rezepte, ${newIngredientNames.length} neue Zutaten.`)
