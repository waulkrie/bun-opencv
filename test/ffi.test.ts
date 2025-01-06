import { describe, expect, test } from 'bun:test';
// import { join } from 'path';
// import {
//   cv_imread,
//   cv_match_template,
//   cv_release_mat,
//   cv_get_size,
//   cv_get_mat_data
// } from '../src/ts/opencv';
// import { LoadImageFlags, TemplateMatchModes } from '../src/ts';

// const TEST_DIR = join(import.meta.dir);

describe.skip('OpenCV FFI Bindings', () => {
  test('should read image', () => {
    const samplePath = join(TEST_DIR, 'sample.png');
    console.log('Loading image from:', samplePath);

    const mat = cv_imread(samplePath, LoadImageFlags.COLOR);
    expect(mat).toBeDefined();

    const width = new Int32Array(1);
    const height = new Int32Array(1);
    cv_get_size(mat, width, height);
    
    console.log('Image size:', { width: width[0], height: height[0] });
    expect(width[0]).toBeGreaterThan(0);
    expect(height[0]).toBeGreaterThan(0);

    cv_release_mat(mat);
  });

  test('should perform template matching', () => {
    const imagePath = join(TEST_DIR, 'sample.png');
    const templatePath = join(TEST_DIR, 'template.png');

    console.log('Loading images from:', { imagePath, templatePath });

    const image = cv_imread(imagePath, LoadImageFlags.COLOR);
    const templ = cv_imread(templatePath, LoadImageFlags.COLOR);

    const result = cv_match_template(
      image,
      templ,
      TemplateMatchModes.TM_CCOEFF_NORMED
    );

    expect(result).toBeDefined();
    
    const width = new Int32Array(1);
    const height = new Int32Array(1);
    cv_get_size(result, width, height);
    
    const imageWidth = new Int32Array(1);
    const imageHeight = new Int32Array(1);
    const templWidth = new Int32Array(1);
    const templHeight = new Int32Array(1);
    
    cv_get_size(image, imageWidth, imageHeight);
    cv_get_size(templ, templWidth, templHeight);

    console.log('Result size:', { width: width[0], height: height[0] });
    expect(width[0]).toBe(imageWidth[0] - templWidth[0] + 1);
    expect(height[0]).toBe(imageHeight[0] - templHeight[0] + 1);

    // Cleanup
    cv_release_mat(image);
    cv_release_mat(templ);
    cv_release_mat(result);
  });

  test('should find match locations', () => {
    const image = cv_imread(
      join(TEST_DIR, 'sample.png'),
      LoadImageFlags.COLOR
    );
    const templ = cv_imread(
      join(TEST_DIR, 'template.png'),
      LoadImageFlags.COLOR
    );

    const result = cv_match_template(
      image,
      templ,
      TemplateMatchModes.TM_CCOEFF_NORMED
    );

    const width = new Int32Array(1);
    const height = new Int32Array(1);
    cv_get_size(result, width, height);
    
    // Get result data
    const resultData = new Float32Array(width[0] * height[0]);
    cv_get_mat_data(result, resultData);

    // Find matches above threshold
    const threshold = 0.8;
    const matches = [];
    for (let y = 0; y < height[0]; y++) {
      for (let x = 0; x < width[0]; x++) {
        const value = resultData[y * width[0] + x];
        if (value >= threshold) {
          matches.push({ x, y, value });
        }
      }
    }

    console.log('Found matches:', matches);
    expect(matches.length).toBeGreaterThan(0);

    // Cleanup
    cv_release_mat(image);
    cv_release_mat(templ);
    cv_release_mat(result);
  });
}); 