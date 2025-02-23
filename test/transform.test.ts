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
} from "../src/ts";
import { join } from 'path';
const TEST_DIR = join(import.meta.dir);

describe("Transform Utils", () => {
  it("should convert color to grayscale", async () => {
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.COLOR);
    const gray = await cvtColorAsync(image, ColorConversionCodes.BGR2GRAY);
    expect(gray).toBeInstanceOf(Mat);
  });

  it("should apply gaussian blur", async () => {
    const image = await imreadAsync(join(TEST_DIR, "sample.png"), LoadImageFlags.COLOR);
    const blurred = await gaussianBlurAsync(image, 5, 1.0);
    expect(blurred).toBeInstanceOf(Mat);
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

//   it("should handle invalid inputs", async () => {
//     const invalidMat = new Mat(0);
    
//     await expect(cvtColorAsync(invalidMat, ColorConversionCodes.BGR2GRAY))
//       .rejects.toThrow();
    
//     await expect(gaussianBlurAsync(invalidMat))
//       .rejects.toThrow();
//   });
}); 