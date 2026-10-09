import { Refused } from './rules';
import type { Photo } from './types';

/* A photograph is made small in the browser before it goes anywhere: drawn
   no more than 720 pixels on its long side and kept as a JPEG. It is small
   enough then to live in the browser's storage, or to ride in a request. */
export async function shrink(file: File, side = 720): Promise<Photo> {
  if (!file.type.startsWith('image/')) throw new Refused('That file is not a picture.');
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Refused('This browser could not read that picture. Try a JPEG or a PNG.');
  const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(16, Math.round(bitmap.width * scale));
  const h = Math.max(16, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  for (const quality of [0.82, 0.68, 0.5]) {
    const src = canvas.toDataURL('image/jpeg', quality);
    if (src.length <= 400_000) return { src, w, h };
  }
  throw new Refused('That picture is too detailed to keep. Try a plainer one.');
}
