export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;

  const { results } = await db
    .prepare(
      `
    SELECT
      stid,
      source_type
    FROM source_types
  `,
    )
    .all();

  return results;
});
