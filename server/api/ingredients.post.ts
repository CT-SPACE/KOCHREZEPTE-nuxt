export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.ACHDB;
  const body = await readBody<{ name?: string }>(event);
  const name = body?.name?.trim();

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name of ingredient is missing",
    });
  }

  // Idempotent: bei Konflikt (auch gleichzeitiger Request) wird nichts eingefügt
  await db
    .prepare("INSERT INTO ingredients (name) VALUES (?) ON CONFLICT DO NOTHING")
    .bind(name)
    .run();

  return (await db
    .prepare("SELECT id, name FROM ingredients WHERE LOWER(name) = LOWER(?)")
    .bind(name)
    .first()) as { id: number; name: string };
});
