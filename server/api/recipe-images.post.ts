export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);

  if (!parts || parts.length !== 2) {
    throw createError({
      statusCode: 400,
      statusMessage: "Zwei Bilddateien sind erforderlich.",
    });
  }

  const big = parts.find((part) => part.name === "big");
  const small = parts.find((part) => part.name === "small");

  if (!big || !small) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bildgröße fehlt.",
    });
  }

  const maxBytes = 5 * 1024 * 1024;

  for (const image of [big, small]) {
    const data = image.data;
    const isWebp =
      data.length >= 12 &&
      data.subarray(0, 4).toString("ascii") === "RIFF" &&
      data.subarray(8, 12).toString("ascii") === "WEBP";

    if (image.type !== "image/webp" || !isWebp || data.length > maxBytes) {
      throw createError({
        statusCode: 400,
        statusMessage: "Ungültiges oder zu großes WebP-Bild.",
      });
    }
  }

  const bucket = event.context.cloudflare.env.RECIPE_IMAGES;
  const imageKey = crypto.randomUUID();
  const bigKey = `recipe-img-big/${imageKey}.webp`;
  const smallKey = `recipe-img-small/${imageKey}.webp`;

  try {
    await bucket.put(bigKey, big.data, {
      httpMetadata: { contentType: "image/webp" },
    });
    await bucket.put(smallKey, small.data, {
      httpMetadata: { contentType: "image/webp" },
    });
  } catch (error) {
    try {
      await bucket.delete([bigKey, smallKey]);
    } catch (cleanupError) {
      console.error(
        "Unvollständiger Bild-Upload konnte nicht bereinigt werden:",
        cleanupError,
      );
    }

    console.error("Bild-Upload fehlgeschlagen:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Die Bilder konnten nicht gespeichert werden.",
    });
  }

  return { imageKey };
});
