import { cc, FFIType } from "bun:ffi";
import { join } from "path";

// Platform-specific OpenCV library names and include paths
const platformConfig = {
  win32: {
    libraries: ["opencv_core480", "opencv_imgcodecs480", "opencv_imgproc480"],
    includePaths: ["C:/opencv/build/include"],
  },
  darwin: {
    libraries: ["opencv_core", "opencv_imgcodecs", "opencv_imgproc"],
    includePaths: ["/usr/local/include/opencv4", "/opt/homebrew/include/opencv4"],
  },
  linux: {
    libraries: ["opencv_core", "opencv_imgcodecs", "opencv_imgproc"],
    includePaths: ["/usr/include/opencv4", "/usr/local/include/opencv4"],
  }
};

const platform = process.platform as keyof typeof platformConfig;
const config = platformConfig[platform] || platformConfig.linux;

const symbols = {
  cv_imread: {
    args: [FFIType.cstring, FFIType.int32_t],
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
  }
};

const opencv = cc({
  source: join(import.meta.dir, "..", "cpp", "template_matcher.c"),
  symbols,
  library: config.libraries,
  flags: config.includePaths.map(path => `-I${path}`),
});

export const {
  cv_imread,
  cv_match_template,
  cv_release_mat,
  cv_get_size,
  cv_get_mat_data
} = opencv.symbols; 
