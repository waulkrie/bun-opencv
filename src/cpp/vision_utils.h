#ifndef VISION_UTILS_HPP
#define VISION_UTILS_HPP


// Generic helper definitions for shared library support
#if defined _WIN32 || defined __CYGWIN__
  #define HELPER_DLL_IMPORT __declspec(dllimport)
  #define HELPER_DLL_EXPORT __declspec(dllexport)
  #define HELPER_DLL_LOCAL
#else
  #if __GNUC__ >= 4
    #define HELPER_DLL_IMPORT __attribute__ ((visibility ("default")))
    #define HELPER_DLL_EXPORT __attribute__ ((visibility ("default")))
    #define HELPER_DLL_LOCAL  __attribute__ ((visibility ("hidden")))
  #endif
#endif

#ifdef BUILDING_DLL
    #define API HELPER_DLL_EXPORT
#else
    #define API HELPER_DLL_IMPORT
#endif
#define LOCAL HELPER_DLL_LOCAL

#ifdef __cplusplus
extern "C" {
#endif

// Basic operations
API void* cv_load_image(const char* filename, int flags);
API bool cv_save_image(const char* filename, void* img_ptr);
API bool cv_is_image_empty(void* img_ptr);
API void cv_show_image(const char* window_name, void* img_ptr);

// Color space conversions
API void* cv_cvt_color(void* src_ptr, int code);
API void* cv_to_gray(void* src_ptr);
API void* cv_to_hsv(void* src_ptr);
API void* cv_to_lab(void* src_ptr);

// Image processing
API void* cv_gaussian_blur(void* src_ptr, int kernel_size, double sigma);
API void* cv_threshold(void* src_ptr, double thresh, double maxval);
API void* cv_equalize_hist(void* src_ptr);

#ifdef __cplusplus
}
#endif

#endif // VISION_UTILS_HPP 