import { dlopen, FFIType, suffix } from 'bun:ffi';
import { join } from 'path';
import type { CvSize } from './types';

// Get the platform-specific library name
function getLibraryPath(): string {
  const platform = process.platform;
  const prefix = platform === 'win32' ? '' : 'lib';
  const libName = `${prefix}template_matcher.${suffix}`;
  const distDir = join(import.meta.dir, '..', '..', 'dist');
  const libPath = join(distDir, libName);
  return libPath;
}

export const { symbols } = dlopen(getLibraryPath(), {
  cv_imread: {
    args: [FFIType.ptr, FFIType.int32_t],
    returns: FFIType.ptr,
  },
  cv_match_template: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.int32_t],
    returns: FFIType.ptr,
  },
  cv_release_mat: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  cv_get_size: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  cv_get_mat_data: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  cv_get_pixel: {
    args: [FFIType.ptr, FFIType.int32_t, FFIType.int32_t],
    returns: FFIType.float,
  },
});

export class Mat {
  readonly #ptr: number;
  #size: CvSize | null = null;  // Cache the size

  constructor(ptr: number | bigint | null) {
    if (ptr === null || ptr === 0) {
      throw new Error('Invalid Mat pointer');
    }
    this.#ptr = ptr as number;
  }

  get ptr(): number {
    return this.#ptr;
  }

  get rows(): number {
    return this.size.height;
  }

  get cols(): number {
    return this.size.width;
  }

  private get size(): CvSize {
    if (!this.#size) {
      this.#size = this.getSize();
    }
    return this.#size;
  }

  release(): void {
    symbols.cv_release_mat(this.#ptr as any);
  }

  getSize(): CvSize {
    const widthBuf = new Int32Array(1);
    const heightBuf = new Int32Array(1);
    symbols.cv_get_size(this.#ptr as any, widthBuf, heightBuf);
    return {
      width: widthBuf[0],
      height: heightBuf[0],
    };
  }

  async getData(buffer: Float32Array): Promise<void> {
    await symbols.cv_get_mat_data(this.#ptr as any, buffer);
  }

  at(row: number, col: number): number {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error('Index out of bounds');
    }
    return symbols.cv_get_pixel(this.#ptr as any, row, col);
  }
}
