export async function reduceImageSize(
  file,
  maxWidth = 1200,
  maxHeight = 1200,
  convertToWebp = false
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      let ratio = Math.min(maxWidth / width, maxHeight / height);
      ratio = ratio >= 1 ? 1 : ratio;
      width = width * ratio;
      height = height * ratio;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = convertToWebp ? "image/webp" : file.type;
      const fileName = convertToWebp
        ? file.name.replace(/\.[^/.]+$/, ".webp")
        : file.name;
      const quality = convertToWebp ? 0.8 : 1;

      canvas.toBlob(
        (blob) => {
          if (!blob) reject(new Error("Failed to create blob"));
          else resolve(new File([blob], fileName, { type: mimeType }));
        },
        mimeType,
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = URL.createObjectURL(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    image.onload = function () {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        resolve(new File([blob], imageSrc.name, { type: imageSrc.type }));
      }, imageSrc.type);
    };
    image.onerror = reject;
  });
}
