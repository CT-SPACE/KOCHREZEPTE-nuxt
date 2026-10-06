export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB
  const { recipe, ingredients = [], sources = [] } = await readBody(event)

  if (!recipe?.title) {
    throw createError({ statusCode: 400, statusMessage: 'title fehlt' })
  }

  const inserted = await db
    .prepare(
      `INSERT INTO recipes (title, description, servings, prep_time, cook_time, category)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      recipe.title,
      recipe.description ?? null,
      recipe.servings ?? null,
      recipe.prep_time ?? null,
      recipe.cook_time ?? null,
      recipe.category ?? null
    )
    .run()

  const recipeId = inserted.meta.last_row_id

  const statements = [
    ...ingredients.map((ing: any) =>
      db
        .prepare(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id)
           VALUES (?, ?, ?, ?)`
        )
        .bind(recipeId, ing.ingredient_id, ing.amount ?? null, ing.unit_id ?? null)
    ),
    ...sources.map((src: any) =>
      db
        .prepare(
          `INSERT INTO sources (recipe_id, source, source_detail, note, source_type_id)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          recipeId,
          src.source ?? null,
          src.source_detail ?? null,
          src.note ?? null,
          src.source_type_id ?? null
        )
    )
  ]

  try {
    if (statements.length) await db.batch(statements)
  } catch (err) {
    // D1 kennt kein BEGIN/COMMIT über mehrere Aufrufe; das Rezept wird manuell zurückgenommen
    await db.prepare(`DELETE FROM recipes WHERE id = ?`).bind(recipeId).run()
    throw err
  }

  return { id: recipeId }
})
