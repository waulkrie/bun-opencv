import { dlopen, FFIType } from 'bun:ffi';
import { join } from 'path';
import type { CvSize } from './types';

// Get the platform-specific library name
function getLibraryPath(): string {
  const platform = process.platform;
  const libName = platform === 'win32' ? 'template_matcher.dll' : 'libtemplate_matcher.so';

  // Check if we're in development or production
  const isDev = process.env.NODE_ENV === 'development';
  const buildDir = isDev
    ? join(import.meta.dir, '..', '..', 'build', 
          platform === 'win32' ? 'bin/Release' : 'lib')
    : join(import.meta.dir, '..', '..', 'build', 'lib');

  console.log(buildDir + '/' + libName);
  return join(buildDir, libName);
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
});

export class Mat {
  readonly #ptr: number;

  constructor(ptr: number | null) {
    if (ptr === null) {
      throw new Error('Invalid Mat pointer');
    }
    this.#ptr = ptr;
  }

  get ptr(): number {
    return this.#ptr;
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
}
