import { describe, expect, it } from "bun:test";
import {
  Mat,
  imreadAsync,
  cvtColorAsync,
  gaussianBlurAsync,
  thresholdAsync,
  equalizeHistAsync,
  ColorConversionCodes,
  LoadImageFlags,
  matchTemplate,
  TemplateMatchModes,
  findMatches,
} from "../src/ts";
import { join } from 'path';
const TEST_DIR = join(import.meta.dir);

describe("Transform Utils", () => {
  it("should convert color to grayscale", async () => {
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.COLOR);
    const gray = await cvtColorAsync(image, ColorConversionCodes.BGR2GRAY);
    // Check specific pixel values that we know should be certain grayscale values
    // Mario's pixels should be around these values
    expect(gray.at(0, 0)).toBeCloseTo(0); // Background should be black/very dark
    expect(gray.rows).toBe(image.rows);
    expect(gray.cols).toBe(image.cols);
  });

  it("should apply gaussian blur", async () => {
    // First find a good edge using template matching
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.COLOR);
    const templ = await imreadAsync(join(TEST_DIR, "template.png"), LoadImageFlags.COLOR);
    
    const result = await matchTemplate(
      image,
      templ,
      TemplateMatchModes.TM_CCOEFF_NORMED
    );
    
    const matches = await findMatches(result, 0.8);
    console.log('Template match magnatude:', matches.length);
    
    // Use the first match location for our blur test
    const matchLoc = matches[2]; //sadge
    const edgeX = matchLoc.x;
    const edgeY = matchLoc.y;
    
    // Now test the blur at our known edge location
    const blurred = await gaussianBlurAsync(image, 5, 1.0);
    
    const originalEdgeValue = image.at(edgeY, edgeX);
    const blurredEdgeValue = blurred.at(edgeY, edgeX);
    
    // Edge should be smoothed, so values should be different
    expect(blurredEdgeValue).not.toBe(originalEdgeValue);
    expect(Math.abs(blurredEdgeValue - originalEdgeValue)).toBeGreaterThan(5);
    
    // Cleanup
    image.release();
    templ.release();
    result.release();
    blurred.release();
  });

  it("should apply threshold", async () => {
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.GRAYSCALE);
    const binary = await thresholdAsync(image, 127, 255);
    expect(binary).toBeInstanceOf(Mat);
  });

  it("should equalize histogram", async () => {
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.GRAYSCALE);
    const equalized = await equalizeHistAsync(image);
    expect(equalized).toBeInstanceOf(Mat);
  });

  it("should chain multiple transformations", async () => {
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.COLOR);
    
    const processed = await cvtColorAsync(image, ColorConversionCodes.BGR2GRAY)
      .then(gray => gaussianBlurAsync(gray))
      .then(blurred => equalizeHistAsync(blurred))
      .then(equalized => thresholdAsync(equalized));
    
    expect(processed).toBeInstanceOf(Mat);
  });

  it("should handle invalid inputs", async () => {
    const invalidMat = new Mat(0n); 
    
    await expect(cvtColorAsync(invalidMat, ColorConversionCodes.BGR2GRAY))
      .rejects.toThrow();
    
    await expect(gaussianBlurAsync(invalidMat))
      .rejects.toThrow();
  });
}); 