# Bun OpenCV

OpenCV bindings for Bun. Access the power of OpenCV through a native TypeScript interface.

## Installation

```bash
bun add @augusdogus/bun-opencv
```

## System Requirements

This package requires OpenCV to be installed on your system as it dynamically links against OpenCV libraries. Install OpenCV using your system's package manager:

- Windows: `choco install opencv`
- Ubuntu/Debian: `sudo apt-get install libopencv-dev`
- macOS: `brew install opencv`

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

### Features

- [x] Template Matching

  - [x] Load images from disk
  - [x] Find patterns in images
  - [x] Get match locations with confidence scores

- [ ] Image Processing

  - [ ] Filters and transformations
  - [ ] Color space conversions

- [ ] Computer Vision

  - [ ] Feature detection
  - [ ] Object tracking
  - [ ] Image segmentation

- [ ] Video Processing
  - [ ] Video capture
  - [ ] Frame analysis
  - [ ] Video writing

## Development

### Prerequisites

- Bun runtime (>= 1.1.42)

If you want to build from source:

- OpenCV 4.x
  - Windows: `choco install opencv`
  - Ubuntu/Debian: `apt-get install libopencv-dev`
  - macOS: `brew install opencv`
- CMake
- C++ compiler:
  - Windows: MSVC (Visual Studio 2019 or newer)
  - Linux: GCC
  - macOS: Clang

### Commands

- `bun run build` - Build the native module
- `bun run build:test` - Build and run tests
- `bun test` - Run tests

## License

MIT
