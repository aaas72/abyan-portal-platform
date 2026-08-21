/**
 * Image optimization & client-side compression utilities for Abyan Portal.
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses an image file directly in the browser using HTML5 Canvas.
 * Reduces 5MB-10MB photos down to ~150KB-300KB in milliseconds without perceptible quality loss.
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = options;

  // Only compress standard image files (not animated gifs or SVGs)
  if (
    !file.type.startsWith("image/") ||
    file.type.includes("svg") ||
    file.type.includes("gif")
  ) {
    return file;
  }

  // If already under 150KB, keep as is
  if (file.size < 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with high quality
        const outputType = "image/webp";
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              return resolve(file);
            }
            const cleanName =
              file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Injects Cloudinary optimization transformations (f_auto, q_auto, responsive sizing)
 * into image URLs for instant CDN delivery and minimal bandwidth usage.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options: { width?: number; quality?: string } = {}
): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // If already transformed with f_auto or q_auto, return as is
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) {
    return url;
  }

  const { width, quality = "auto" } = options;
  const transformations = [`f_auto`, `q_${quality}`];
  if (width) {
    transformations.push(`w_${width}`, `c_limit`);
  }

  const transformString = transformations.join(",");
  return url.replace("/upload/", `/upload/${transformString}/`);
}
