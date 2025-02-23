#include "vision_utils.hpp"

cv::Mat VisionUtils::loadImage(const std::string& path, int flags) {
    cv::Mat image = cv::imread(path, flags);
    if (image.empty()) {
        throw std::runtime_error("Failed to load image: " + path);
    }
    return image;
}

bool VisionUtils::saveImage(const std::string& path, const cv::Mat& image) {
    try {
        return cv::imwrite(path, image);
    } catch (const cv::Exception& e) {
        throw std::runtime_error("Failed to save image: " + std::string(e.what()));
    }
}

cv::Mat VisionUtils::toGray(const cv::Mat& input) {
    if (input.empty()) {
        throw std::runtime_error("Input image is empty");
    }
    
    cv::Mat output;
    if (input.channels() == 1) {
        input.copyTo(output);
    } else {
        cv::cvtColor(input, output, cv::COLOR_BGR2GRAY);
    }
    return output;
}

cv::Mat VisionUtils::toHSV(const cv::Mat& input) {
    if (input.empty()) {
        throw std::runtime_error("Input image is empty");
    }
    
    cv::Mat output;
    cv::cvtColor(input, output, cv::COLOR_BGR2HSV);
    return output;
}

cv::Mat VisionUtils::applyGaussianBlur(const cv::Mat& input, const cv::Size& kernel_size) {
    if (input.empty()) {
        throw std::runtime_error("Input image is empty");
    }
    
    cv::Mat output;
    cv::GaussianBlur(input, output, kernel_size, 0);
    return output;
}

cv::Mat VisionUtils::applyThreshold(const cv::Mat& input, double thresh, double maxval) {
    if (input.empty()) {
        throw std::runtime_error("Input image is empty");
    }
    
    cv::Mat output;
    cv::Mat gray = input.channels() > 1 ? toGray(input) : input;
    cv::threshold(gray, output, thresh, maxval, cv::THRESH_BINARY);
    return output;
}

cv::Mat VisionUtils::equalizeHistogram(const cv::Mat& input) {
    if (input.empty()) {
        throw std::runtime_error("Input image is empty");
    }
    
    cv::Mat output;
    if (input.channels() == 1) {
        cv::equalizeHist(input, output);
    } else {
        cv::Mat gray = toGray(input);
        cv::equalizeHist(gray, output);
    }
    return output;
}

bool VisionUtils::isImageEmpty(const cv::Mat& image) {
    return image.empty();
}

void VisionUtils::showImage(const std::string& window_name, const cv::Mat& image) {
    if (image.empty()) {
        throw std::runtime_error("Cannot display empty image");
    }
    
    cv::namedWindow(window_name, cv::WINDOW_AUTOSIZE);
    cv::imshow(window_name, image);
    cv::waitKey(1); // Update the window
} 