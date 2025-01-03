export { Mat } from './mat';
export * from './types';
import { Mat, symbols } from './mat';
import {
  LoadImageFlags,
  TemplateMatchModes,
  type MatchLocation,
} from './types';

export async function imreadAsync(
  filename: string,
  flags = LoadImageFlags.COLOR
): Promise<Mat> {
  const ptr = await symbols.cv_imread(Buffer.from(filename + '\0'), flags);
  if (!ptr) {
    throw new Error('Failed to read image');
  }
  return new Mat(ptr as number);
}

export async function matchTemplate(
  image: Mat,
  templ: Mat,
  method: TemplateMatchModes
): Promise<Mat> {
  const result = await symbols.cv_match_template(
    image.ptr as any,
    templ.ptr as any,
    method
  );
  if (!result) {
    throw new Error('Failed to perform template matching');
  }
  return new Mat(result as number);
}

export async function findMatches(
  result: Mat,
  threshold: number = 0.8
): Promise<MatchLocation[]> {
  const size = result.getSize();
  const matches: MatchLocation[] = [];

  const data = new Float32Array(size.width * size.height);
  await result.getData(data);

  for (let y = 0; y < size.height; y++) {
    for (let x = 0; x < size.width; x++) {
      const value = data[y * size.width + x];
      if (value >= threshold) {
        matches.push({ x, y, confidence: value });
      }
    }
  }

  return matches;
}
