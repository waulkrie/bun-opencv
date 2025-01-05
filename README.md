# Bun OpenCV

OpenCV bindings for Bun. Access the power of OpenCV through a native TypeScript interface.

## Features

Currently implemented:

- Template Matching
  - Load images from disk
  - Find patterns in images
  - Get match locations with confidence scores

Planned:

- Image Processing
  - Filters and transformations
  - Color space conversions
- Computer Vision
  - Feature detection
  - Object tracking
  - Image segmentation
- Video Processing
  - Video capture
  - Frame analysis
  - Video writing

## Prerequisites

- OpenCV 4.x
- Bun runtime (>= 1.1.42)
- CMake
- A C++ compiler:
  - Windows: MSVC (Visual Studio 2019 or newer)
  - Linux/macOS: GCC or Clang
- Environment variables:
  - OPENCV_DIR: Path to OpenCV root directory
  - OPENCV_BIN_DIR: Path to OpenCV shared libraries
  - OPENCV_INCLUDE_DIR: Path to OpenCV headers
  - OPENCV_LIB_DIR: Path to OpenCV libraries
  - Add OPENCV_BIN_DIR to your system's library path:
    - Windows: Add to PATH
    - Linux: Add to LD_LIBRARY_PATH
    - macOS: Add to DYLD_LIBRARY_PATH

Example paths:

- Windows: C:\tools\opencv\build
- Linux: /usr/local/opencv
- macOS: /usr/local/opt/opencv

## Installation

```bash
bun add @augusdogus/bun-opencv
```

## Usage

### Template Matching Example

```typescript
import {
  imreadAsync,
  matchTemplate,
  findMatches,
  LoadImageFlags,
  TemplateMatchModes,
} from '@augusdogus/bun-opencv';

// Load image and template
const image = await imreadAsync('path/to/image.png', LoadImageFlags.COLOR);
const templ = await imreadAsync('path/to/template.png', LoadImageFlags.COLOR);

// Find all instances of template in image
const result = await matchTemplate(
  image,
  templ,
  TemplateMatchModes.TM_CCOEFF_NORMED
);

// Get matches above 80% confidence
const matches = await findMatches(result, 0.8);
console.log('Found matches:', matches);

// Clean up
image.release();
templ.release();
result.release();
```

## Development

- `bun run build` - Build the native module
- `bun run build:test` - Build and run tests
- `bun test` - Run tests

## License

MIT
