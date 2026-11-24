export default defineEventHandler(async (event) => {
  const size = getRouterParam(event, "size");
  const key = getRouterParam(event, "key");

  if (
    (size !== "big" && size !== "small") ||
    !key ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      key,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ungültige Bildanfrage.",
    });
  }

  const bucket = event.context.cloudflare.env.RECIPE_IMAGES;
  const image = await bucket.get(`recipe-img-${size}/${key}.webp`);

  if (!image) {
    throw createError({
      statusCode: 404,
      statusMessage: "Bild nicht gefunden.",
    });
  }

  setResponseHeader(event, "Content-Type", "image/webp");
  return sendStream(event, image.body);
});
