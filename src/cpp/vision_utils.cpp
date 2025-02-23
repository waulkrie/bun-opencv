#include <opencv2/core.hpp>        // For cv::Mat
#include <opencv2/imgcodecs.hpp>   // For cv::imread
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
#include "vision_utils.h"

// Color conversion wrapper
void* cv_cvt_color(void* src_ptr, int code) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        cv::cvtColor(*src, *dst, code);
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}

// Gaussian blur wrapper
void* cv_gaussian_blur(void* src_ptr, int kernel_size, double sigma) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        cv::GaussianBlur(*src, *dst, cv::Size(kernel_size, kernel_size), sigma);
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}

// Threshold wrapper
void* cv_threshold(void* src_ptr, double thresh, double maxval) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        // Convert to grayscale if needed
        cv::Mat gray;
        if (src->channels() > 1) {
            cv::cvtColor(*src, gray, cv::COLOR_BGR2GRAY);
        } else {
            gray = *src;
        }
        
        cv::threshold(gray, *dst, thresh, maxval, cv::THRESH_BINARY);
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}

// Histogram equalization wrapper
void* cv_equalize_hist(void* src_ptr) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        // Convert to grayscale if needed
        cv::Mat gray;
        if (src->channels() > 1) {
            cv::cvtColor(*src, gray, cv::COLOR_BGR2GRAY);
        } else {
            gray = *src;
        }
        
        cv::equalizeHist(gray, *dst);
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}

// Basic operations
void* cv_load_image(const char* filename, int flags) {
    if (!filename) return nullptr;
    
    try {
        auto* mat = new cv::Mat(cv::imread(filename, flags));
        if (mat->empty()) {
            delete mat;
            return nullptr;
        }
        return mat;
    } catch (...) {
        return nullptr;
    }
}

bool cv_save_image(const char* filename, void* img_ptr) {
    if (!filename || !img_ptr) return false;
    
    try {
        auto* mat = static_cast<cv::Mat*>(img_ptr);
        return cv::imwrite(filename, *mat);
    } catch (...) {
        return false;
    }
}

bool cv_is_image_empty(void* img_ptr) {
    if (!img_ptr) return true;
    auto* mat = static_cast<cv::Mat*>(img_ptr);
    return mat->empty();
}

void cv_show_image(const char* window_name, void* img_ptr) {
    if (!window_name || !img_ptr) return;
    
    try {
        auto* mat = static_cast<cv::Mat*>(img_ptr);
        cv::namedWindow(window_name, cv::WINDOW_AUTOSIZE);
        cv::imshow(window_name, *mat);
        cv::waitKey(1);
    } catch (...) {
        // Silently fail
    }
}

// Color space conversions
void* cv_to_gray(void* src_ptr) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        if (src->channels() == 1) {
            src->copyTo(*dst);
        } else {
            cv::cvtColor(*src, *dst, cv::COLOR_BGR2GRAY);
        }
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}

void* cv_to_hsv(void* src_ptr) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        cv::cvtColor(*src, *dst, cv::COLOR_BGR2HSV);
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}

void* cv_to_lab(void* src_ptr) {
    if (!src_ptr) return nullptr;
    
    auto* src = static_cast<cv::Mat*>(src_ptr);
    auto* dst = new cv::Mat();
    
    try {
        cv::cvtColor(*src, *dst, cv::COLOR_BGR2Lab);
        return dst;
    } catch (...) {
        delete dst;
        return nullptr;
    }
}
