import { Mat } from './mat';
import { dlopen, FFIType, suffix } from 'bun:ffi';
import { join } from 'path';
import type { CvSize } from './types';

// Get the platform-specific library name
function getLibraryPath(): string {
  const platform = process.platform;
  const prefix = platform === 'win32' ? '' : 'lib';
  const libName = `${prefix}template_matcher.${suffix}`;

  const binDir = platform === 'win32' ? 'bin/Release' : 'lib';
  const buildDir = join(import.meta.dir, '..', '..', 'build', binDir);

  const libPath = join(buildDir, libName);
  return libPath;
}

export enum ColorConversionCodes {
  BGR2GRAY = 6,
  BGR2HSV = 40,
  BGR2Lab = 44,
}

// Define and load the transform symbols
const { symbols } = dlopen(getLibraryPath(), {
  cv_cvt_color: {
    args: ["pointer", "i32"],
    returns: "pointer",
  } as const,
  
  cv_gaussian_blur: {
    args: ["pointer", "i32", "f64"],
    returns: "pointer",
  } as const,
  
  cv_threshold: {
    args: ["pointer", "f64", "f64"],
    returns: "pointer",
  } as const,
  
  cv_equalize_hist: {
    args: ["pointer"],
    returns: "pointer",
  } as const,
});

// Export the transform functions
export async function cvtColorAsync(
  src: Mat,
  code: ColorConversionCodes
): Promise<Mat> {
  const ptr = await symbols.cv_cvt_color(src.ptr as any, code);
  if (!ptr) {
    throw new Error('Failed to convert color space');
  }
  return new Mat(ptr as number);
}

export async function gaussianBlurAsync(
  src: Mat,
  kernelSize: number = 5,
  sigma: number = 0
): Promise<Mat> {
  const ptr = await symbols.cv_gaussian_blur(
    src.ptr as any,
    kernelSize,
    sigma
  );
  if (!ptr) {
    throw new Error('Failed to apply Gaussian blur');
  }
  return new Mat(ptr as number);
}

export async function thresholdAsync(
  src: Mat,
  thresh: number = 127,
  maxval: number = 255
): Promise<Mat> {
  const ptr = await symbols.cv_threshold(
    src.ptr as any,
    thresh,
    maxval
  );
  if (!ptr) {
    throw new Error('Failed to apply threshold');
  }
  return new Mat(ptr as number);
}

export async function equalizeHistAsync(
  src: Mat
): Promise<Mat> {
  const ptr = await symbols.cv_equalize_hist(src.ptr as any);
  if (!ptr) {
    throw new Error('Failed to equalize histogram');
  }
  return new Mat(ptr as number);
} 