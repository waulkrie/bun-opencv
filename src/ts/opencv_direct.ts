import { dlopen, FFIType, suffix } from 'bun:ffi';
import { join } from 'path';

// Get the platform-specific library name
export function getLibraryPath(): string {
  const platform = process.platform;
  const prefix = platform === 'win32' ? '' : 'lib';
  
  // OpenCV library name differs by platform
  let libName: string;
  if (platform === 'win32') {
    libName = 'opencv_world490.dll';  // Adjust version number as needed
  } else if (platform === 'darwin') {
    libName = `${prefix}opencv_world.4.9.0.dylib`;  // Adjust version number as needed
  } else {
    libName = `${prefix}opencv_world.so.4.9`;  // Adjust version number as needed
  }

  // On Unix systems, OpenCV is typically installed in standard library locations
  if (platform === 'win32') {
    return join(import.meta.dir, '..', '..', 'build', 'bin', 'Release', libName);
  } else if (platform === 'darwin') {
    return join('/usr/local/lib', libName);
  } else {
    return join('/usr/lib', libName);
  }
}

let symbolsInstance: any = null;

export function getSymbols() {
  if (!symbolsInstance) {
    symbolsInstance = dlopen(getLibraryPath(), {
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
    }).symbols;
  }
  return symbolsInstance;
} 