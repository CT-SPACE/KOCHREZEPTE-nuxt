export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const { recipe, ingredients = [], sources = [] } = await readBody(event);

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

  const newRecipeId = `(SELECT seq FROM sqlite_sequence WHERE name = 'recipes')`;

  const statements = [
    db
      .prepare(
        `INSERT INTO recipes (title, description, servings, prep_time, cook_time, category)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        recipe.title,
        recipe.description ?? null,
        recipe.servings ?? null,
        recipe.prep_time ?? null,
        recipe.cook_time ?? null,
        recipe.category ?? null,
      ),
    ...sources.map((src: any) =>
      db
        .prepare(
          `INSERT INTO sources (recipe_id, source, source_detail, note, source_type_id)
           VALUES (${newRecipeId}, ?, ?, ?, ?)`,
        )
        .bind(
          src.source ?? null,
          src.source_detail ?? null,
          src.note ?? null,
          src.source_type_id ?? null,
        ),
    ),
    ...ingredients.map((ing: any) =>
      db
        .prepare(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id)
           VALUES (${newRecipeId}, ?, ?, ?)`,
        )
        .bind(ing.ingredient_id, ing.amount ?? null, ing.unit_id ?? null),
    ),
  ];
  const results = await db.batch(statements);
  return { id: results[0].meta.last_row_id };
});
