export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const id = Number(getRouterParam(event, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: "invalid id" });
  }

  const { results } = await db
    .prepare(
      `SELECT id, recipe_id, ingredient_id, amount, unit_id
       FROM recipe_ingredients
       WHERE recipe_id = ?`,
    )
    .bind(id)
    .all();

  return results;
});
