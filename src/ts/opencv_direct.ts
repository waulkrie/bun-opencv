import { dlopen, FFIType, suffix } from 'bun:ffi';
import { join } from 'path';

// Get the platform-specific library name
export function getLibraryPath(): string {
  const platform = process.platform;
  const prefix = platform === 'win32' ? '' : 'lib';
  const libName = `${prefix}template_matcher.${suffix}`;

  const binDir = platform === 'win32' ? 'bin/Release' : 'lib';
  const buildDir = join(import.meta.dir, '..', '..', 'build', binDir);

  const libPath = join(buildDir, libName);
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
}); 