import { describe, expect, it } from "bun:test";
import { TemplateMatcher } from "./template_matcher";
import { join } from "path";

describe("TemplateMatcher", () => {
  const testImagesPath = join(import.meta.dir, "..", "..", "test", "");

  it("should read an image file", () => {
    const imagePath = join(testImagesPath, "sample.png");
    const mat = TemplateMatcher.imread(imagePath, 0);
    
    const size = TemplateMatcher.getSize(mat);
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });

  it("should perform template matching", () => {
    const imagePath = join(testImagesPath, "sample.png");
    const templatePath = join(testImagesPath, "template.png");
    
    const image = TemplateMatcher.imread(imagePath, 0);
    const templ = TemplateMatcher.imread(templatePath, 0);
    
    const result = TemplateMatcher.matchTemplate(image, templ, 0); // CV_TM_SQDIFF
    
    const size = TemplateMatcher.getSize(result);
    expect(size.width).toBe(TemplateMatcher.getSize(image).width - TemplateMatcher.getSize(templ).width + 1);
    expect(size.height).toBe(TemplateMatcher.getSize(image).height - TemplateMatcher.getSize(templ).height + 1);
    
    const data = TemplateMatcher.getMatData(result, size.width * size.height);
    expect(data.length).toBe(size.width * size.height);
    expect(Math.min(...data)).toBeGreaterThanOrEqual(0);
  });

  it("should throw error when image file doesn't exist", () => {
    const nonExistentPath = join(testImagesPath, "nonexistent.png");
    expect(() => TemplateMatcher.imread(nonExistentPath, 0)).toThrow();
  });

  it("should get correct image size", () => {
    const imagePath = join(testImagesPath, "sample.png");
    const mat = TemplateMatcher.imread(imagePath, 0);
    
    const size = TemplateMatcher.getSize(mat);
    expect(size).toEqual(expect.objectContaining({
      width: expect.any(Number),
      height: expect.any(Number)
    }));
  });

  it("should get mat data as Float32Array", () => {
    const imagePath = join(testImagesPath, "sample.png");
    const mat = TemplateMatcher.imread(imagePath, 0);
    
    const size = TemplateMatcher.getSize(mat);
    const data = TemplateMatcher.getMatData(mat, size.width * size.height);
    
    expect(data).toBeInstanceOf(Float32Array);
    expect(data.length).toBe(size.width * size.height);
  });
}); 