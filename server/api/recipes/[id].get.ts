export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id <= 0)
    throw createError({ statusCode: 400, statusMessage: "invalid id" });

  const recipe = await db
    .prepare(
      `
    SELECT r.id, r.title, r.description, r.category, r.prep_time, r.cook_time, st.source_type
    FROM recipes r
    LEFT JOIN sources s ON s.recipe_id = r.id
    LEFT JOIN source_types st ON st.stid = s.source_type_id
    WHERE r.id = ?`,
    )
    .bind(id)
    .first();
  if (!recipe) throw createError({ statusCode: 404 });

  const { results: ingredients } = await db
    .prepare(
      `
    SELECT i.name, ri.amount, u.abbreviation AS unit
    FROM recipe_ingredients ri
    JOIN ingredients i ON i.id = ri.ingredient_id
    LEFT JOIN units u ON u.id = ri.unit_id
    WHERE ri.recipe_id = ?`,
    )
    .bind(id)
    .all();

  return { ...recipe, ingredients };
});
