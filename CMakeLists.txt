cmake_minimum_required(VERSION 3.10)
project(template_matcher)

# Use environment variable for OpenCV location
set(OpenCV_DIR "$ENV{OPENCV_DIR}/build")

# Verify OpenCV exists
if(NOT EXISTS ${OpenCV_DIR})
    message(FATAL_ERROR "OpenCV CMake files not found at ${OpenCV_DIR}. Please check your OPENCV_DIR environment variable.")
endif()

find_package(OpenCV REQUIRED)
message(STATUS "OpenCV library status:")
message(STATUS "    version: ${OpenCV_VERSION}")
message(STATUS "    libraries: ${OpenCV_LIBS}")
message(STATUS "    include path: ${OpenCV_INCLUDE_DIRS}")

add_library(template_matcher SHARED src/cpp/template_matcher.cpp)
target_include_directories(template_matcher PRIVATE ${OpenCV_INCLUDE_DIRS})
target_link_libraries(template_matcher ${OpenCV_LIBS})

set_target_properties(template_matcher PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
) 