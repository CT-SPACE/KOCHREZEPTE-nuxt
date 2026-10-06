export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;

  const { results } = await db
    .prepare(
      `
SELECT 
  r.id,
  r.title,
  r.description,
  r.servings,
  r.prep_time,
  r.cook_time,
  r.category,

  s.source,
  s.source_detail,
  s.note,
  s.source_type_id,

  st.source_type,

  ri.id AS recipe_ingredient_id,
  ri.ingredient_id,
  ri.amount,
  ri.unit_id,

  ing.name AS ingredient_name,
  ing.type AS ingredient_type,

  un.name AS unit_name,
  un.abbreviation AS unit_abbreviation

FROM recipes r
LEFT JOIN sources s 
  ON s.recipe_id = r.id

LEFT JOIN source_types st 
  ON st.stid = s.source_type_id

LEFT JOIN recipe_ingredients ri
  ON ri.recipe_id = r.id

LEFT JOIN ingredients ing
  ON ing.id = ri.ingredient_id

  LEFT JOIN units un
  ON un.id = ri.unit_id


  `,
    )
    .all();

  return results;
});
