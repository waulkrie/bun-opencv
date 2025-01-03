import { describe, expect, test } from 'bun:test';
import { join } from 'path';
import {
  findMatches,
  imreadAsync,
  LoadImageFlags,
  matchTemplate,
  TemplateMatchModes,
} from '../src/ts';

const TEST_DIR = join(import.meta.dir);

describe('OpenCV Bindings', () => {
  test('should read image', async () => {
    const samplePath = join(TEST_DIR, 'sample.png');
    console.log('Loading image from:', samplePath);

    const mat = await imreadAsync(samplePath, LoadImageFlags.COLOR);
    expect(mat).toBeDefined();

    const size = mat.getSize();
    console.log('Image size:', size);
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);

    mat.release();
  });

  test('should perform template matching', async () => {
    const imagePath = join(TEST_DIR, 'sample.png');
    const templatePath = join(TEST_DIR, 'template.png');

    console.log('Loading images from:', { imagePath, templatePath });

    const image = await imreadAsync(imagePath, LoadImageFlags.COLOR);
    const templ = await imreadAsync(templatePath, LoadImageFlags.COLOR);

    const result = await matchTemplate(
      image,
      templ,
      TemplateMatchModes.TM_CCOEFF_NORMED
    );

    expect(result).toBeDefined();
    const size = result.getSize();
    console.log('Result size:', size);
    expect(size.width).toBe(image.getSize().width - templ.getSize().width + 1);
    expect(size.height).toBe(
      image.getSize().height - templ.getSize().height + 1
    );

    // Cleanup
    image.release();
    templ.release();
    result.release();
  });

  test('should find match locations', async () => {
    const image = await imreadAsync(
      join(TEST_DIR, 'sample.png'),
      LoadImageFlags.COLOR
    );
    const templ = await imreadAsync(
      join(TEST_DIR, 'template.png'),
      LoadImageFlags.COLOR
    );

    const result = await matchTemplate(
      image,
      templ,
      TemplateMatchModes.TM_CCOEFF_NORMED
    );

    const matches = await findMatches(result, 0.8);
    console.log('Found matches:', matches);
    expect(matches.length).toBeGreaterThan(0);

    // Cleanup
    image.release();
    templ.release();
    result.release();
  });
});
