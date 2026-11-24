async function resizeImage(
  source: HTMLCanvasElement,
  width: number,
  height: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Das Bild konnte nicht verarbeitet werden.");
  }

  context.drawImage(source, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(new Error("Das WebP-Bild konnte nicht erstellt werden."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      0.9,
    );
  });
}

export async function createRecipeImageSizes(source: HTMLCanvasElement) {
  if (source.width < 1500 || source.height < 300) {
    throw new Error(
      "Der gewählte Ausschnitt muss mindestens 1500 × 300 Pixel groß sein.",
    );
  }

  const big = await resizeImage(source, 1500, 300);
  const small = await resizeImage(source, 800, 160);

  return { big, small };
}
