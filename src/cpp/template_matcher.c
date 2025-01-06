#include <opencv2/core/core_c.h>        // For cv::Mat
#include <opencv2/imgcodecs/imgcodecs_c.h>   // For cv::imread
#include <opencv2/imgproc/imgproc_c.h>     // For cv::matchTemplate
#include <opencv2/imgcodecs/legacy/constants_c.h>
#include "template_matcher.h"
#include <string.h>  // for memcpy

// Image reading wrapper
void* cv_imread(const char* filename, int flags) {
    IplImage* img = cvLoadImage(filename, flags);
    CvMat* mat = cvCreateMat(img->height, img->width, CV_32F);
    cvConvert(img, mat);
    cvReleaseImage(&img);
    return mat;
}

// Template matching wrapper
void* cv_match_template(void* image_ptr, void* templ_ptr, int method) {
    CvMat* image = (CvMat*)image_ptr;
    CvMat* templ = (CvMat*)templ_ptr;
    
    // Create result matrix
    CvSize result_size;
    result_size.width = image->width - templ->width + 1;
    result_size.height = image->height - templ->height + 1;
    CvMat* result = cvCreateMat(result_size.height, result_size.width, CV_32F);
    
    cvMatchTemplate(image, templ, result, method);
    return result;
}

// Release Mat wrapper
void cv_release_mat(void* mat_ptr) {
    if (mat_ptr) {
        CvMat* mat = (CvMat*)mat_ptr;
        cvReleaseMat(&mat);
    }
}

// Get image size wrapper
void cv_get_size(void* mat_ptr, int* width, int* height) {
    if (mat_ptr && width && height) {
        CvMat* mat = (CvMat*)mat_ptr;
        *width = mat->width;
        *height = mat->height;
    } else {
        if (width) *width = 0;
        if (height) *height = 0;
    }
}

// Get Mat data wrapper
void cv_get_mat_data(void* mat_ptr, float* buffer) {
    CvMat* mat = (CvMat*)mat_ptr;
    memcpy(buffer, mat->data.fl, mat->rows * mat->cols * sizeof(float));
}

