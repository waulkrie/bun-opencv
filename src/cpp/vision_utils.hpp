#ifndef VISION_UTILS_HPP
#define VISION_UTILS_HPP

#include <opencv2/opencv.hpp>
#include <string>

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

// C-style API functions for FFI
API void* cv_cvt_color(void* src_ptr, int code);
API void* cv_gaussian_blur(void* src_ptr, int kernel_size, double sigma);
API void* cv_threshold(void* src_ptr, double thresh, double maxval);
API void* cv_equalize_hist(void* src_ptr);

#ifdef __cplusplus
}

// C++ class implementation
class VisionUtils {
public:
    // Basic image loading and saving
    static cv::Mat loadImage(const std::string& path, int flags = cv::IMREAD_COLOR);
    static bool saveImage(const std::string& path, const cv::Mat& image);

    // Essential color space conversions
    static cv::Mat toGray(const cv::Mat& input);
    static cv::Mat toHSV(const cv::Mat& input);
    
    // Basic image processing
    static cv::Mat applyGaussianBlur(const cv::Mat& input, const cv::Size& kernel_size = cv::Size(5, 5));
    static cv::Mat applyThreshold(const cv::Mat& input, double thresh = 127, double maxval = 255);
    
    // Image enhancement
    static cv::Mat equalizeHistogram(const cv::Mat& input);
    
    // Utility functions
    static bool isImageEmpty(const cv::Mat& image);
    static void showImage(const std::string& window_name, const cv::Mat& image);

private:
    // Private constructor to prevent instantiation
    VisionUtils() = delete;
};

#endif // __cplusplus
#endif // VISION_UTILS_HPP 