import type { Area } from "react-easy-crop";

export function loadImageForCrop(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export type CropExportOptions = {
  mimeType?: string;
  quality?: number;
};

/**
 * Rasterize `pixelCrop` from `imageSrc` into `outputWidth` × `outputHeight`
 * JPEG by default for consistent storage sizing.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number,
  outputHeight: number,
  options?: CropExportOptions
): Promise<Blob> {
  const image = await loadImageForCrop(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  const mimeType = options?.mimeType ?? "image/jpeg";
  const quality = options?.quality ?? 0.9;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      mimeType,
      quality
    );
  });
}
