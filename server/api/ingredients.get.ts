export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const { results } = await db
    .prepare(`SELECT id, name FROM ingredients ORDER BY name COLLATE NOCASE`)
    .all();
  return results;
});
