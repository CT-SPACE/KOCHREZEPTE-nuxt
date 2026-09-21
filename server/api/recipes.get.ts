export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;

  const { results } = await db.prepare(
      `
    SELECT 
       r.id,
      r.title,
      r.description,
      r.servings,
      r.prep_time,
      r.cook_time,     
      s.source,
      s.source_detail,
      s.note,
      s.source_type_id,   
      st.source_type,
      s.recipe_id,
      r.category
    FROM recipes r
    LEFT JOIN sources s ON s.recipe_id = r.id
    LEFT JOIN source_types st ON st.stid = s.source_type_id
  `,
    )
    .all();

  return results;
});
