// export default defineEventHandler(async (event) => {
//   const db = event.context.cloudflare.env.ACHDB;
//   const id = Number(getRouterParam(event, "id"));
//   const { results } = await db
//     .prepare(
//       `SELECT id, recipe_id, ingredient_id, amount, unit_id FROM recipe_ingredients WHERE recipe_id = ?`,
//     )
//     .bind(id)
//     .all();
//   return results;
// });

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const { results } = await db
    .prepare(`SELECT id, name FROM ingredients ORDER BY name COLLATE NOCASE`)
    .all();
  return results;
});
