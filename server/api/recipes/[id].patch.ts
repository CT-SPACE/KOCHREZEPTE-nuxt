export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const id = Number(getRouterParam(event, "id"));
  const { recipe, ingredients = [], sources = [] } = await readBody(event);

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: "invalid id" });
  }
  if (!recipe?.title) {
    throw createError({ statusCode: 400, statusMessage: "title is missing" });
  }
  if (!Array.isArray(ingredients) || !Array.isArray(sources)) {
    throw createError({
      statusCode: 400,
      statusMessage: "ingredients and sources must be arrays",
    });
  }
  if (
    !ingredients.every(
      (i: any) => Number.isInteger(i.ingredient_id) && i.ingredient_id > 0,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "ingredient without valid id",
    });
  }

  const statements = [
    db
      .prepare(
        `UPDATE recipes
         SET title = ?, description = ?, servings = ?, prep_time = ?, cook_time = ?,
             category = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(
        recipe.title,
        recipe.description ?? null,
        recipe.servings ?? null,
        recipe.prep_time ?? null,
        recipe.cook_time ?? null,
        recipe.category ?? null,
        id,
      ),
    db.prepare(`DELETE FROM sources WHERE recipe_id = ?`).bind(id),
    ...sources.map((src: any) =>
      db
        .prepare(
          `INSERT INTO sources (recipe_id, source, source_detail, note, source_type_id)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(
          id,
          src.source ?? null,
          src.source_detail ?? null,
          src.note ?? null,
          src.source_type_id ?? null,
        ),
    ),
    db.prepare(`DELETE FROM recipe_ingredients WHERE recipe_id = ?`).bind(id),
    ...ingredients.map((ing: any) =>
      db
        .prepare(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id)
           VALUES (?, ?, ?, ?)`,
        )
        .bind(id, ing.ingredient_id, ing.amount ?? null, ing.unit_id ?? null),
    ),
  ];

  await db.batch(statements);
  return { id };
});
