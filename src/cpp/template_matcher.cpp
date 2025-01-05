#include <opencv2/core.hpp>        // For cv::Mat
#include <opencv2/imgcodecs.hpp>   // For cv::imread
#include <opencv2/imgproc.hpp>     // For cv::matchTemplate
#include "template_matcher.h"

// Image reading wrapper
void* cv_imread(const char* filename, int flags) {
    auto* mat = new cv::Mat(cv::imread(filename, flags));
    return mat;
}

// Template matching wrapper
void* cv_match_template(void* image_ptr, void* templ_ptr, int method) {
    auto* image = static_cast<cv::Mat*>(image_ptr);
    auto* templ = static_cast<cv::Mat*>(templ_ptr);
    auto* result = new cv::Mat();
    
    cv::matchTemplate(*image, *templ, *result, method);
    return result;
}

// Release Mat wrapper
void cv_release_mat(void* mat_ptr) {
    if (mat_ptr) {
        auto* mat = static_cast<cv::Mat*>(mat_ptr);
        delete mat;
    }
}

// Get image size wrapper
void cv_get_size(void* mat_ptr, int* width, int* height) {
    if (mat_ptr && width && height) {
        auto* mat = static_cast<cv::Mat*>(mat_ptr);
        *width = mat->cols;
        *height = mat->rows;
    } else {
        if (width) *width = 0;
        if (height) *height = 0;
    }
}

// Get Mat data wrapper
void cv_get_mat_data(void* mat_ptr, float* buffer) {
    auto* mat = static_cast<cv::Mat*>(mat_ptr);
    memcpy(buffer, mat->ptr<float>(), mat->rows * mat->cols * sizeof(float));
} 