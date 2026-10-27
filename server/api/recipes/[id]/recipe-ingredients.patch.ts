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

  await db.batch([
    db.prepare(`DELETE FROM recipe_ingredients WHERE recipe_id = ?`).bind(id),
    ...ingredients.map((ing: any) =>
      db
        .prepare(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id) VALUES (?, ?, ?, ?)`,
        )
        .bind(id, ing.ingredient_id, ing.amount ?? null, ing.unit_id ?? null),
    ),
  ]);
  return { id };
});
