#pragma once

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

// Now we use the generic helper definitions to define API and LOCAL
// API is used for the public API symbols. It either DLL imports or DLL exports
#ifdef BUILDING_DLL
    #define API HELPER_DLL_EXPORT
#else
    #define API HELPER_DLL_IMPORT
#endif
#define LOCAL HELPER_DLL_LOCAL

#ifdef __cplusplus
extern "C" {
#endif

API void* cv_imread(const char* filename, int flags);
API void* cv_match_template(void* image_ptr, void* templ_ptr, int method);
API void cv_release_mat(void* mat_ptr);
API void cv_get_size(void* mat_ptr, int* width, int* height);
API void cv_get_mat_data(void* mat_ptr, float* buffer);

#ifdef __cplusplus
}
#endif 