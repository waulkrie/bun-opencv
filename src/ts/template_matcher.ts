import { getSymbols } from './opencv_direct';
import { ptr } from 'bun:ffi';
import { Mat } from './mat';

export class TemplateMatcher {
  // Image reading wrapper
  static imread(filename: string, flags: number): Mat {
    const matPtr = getSymbols().cv_imread(ptr(Buffer.from(filename + '\0')), flags);
    return new Mat(matPtr);
  }

  // Template matching wrapper
  static matchTemplate(image: Mat, templ: Mat, method: number): Mat {
    const resultPtr = getSymbols().cv_match_template(image.ptr, templ.ptr, method);
    return new Mat(resultPtr);
  }

  // Get image size wrapper
  static getSize(mat: Mat): { width: number, height: number } {
    const sizeBuffer = new Int32Array(2);
    getSymbols().cv_get_size(mat.ptr, ptr(sizeBuffer), ptr(sizeBuffer.subarray(1)));
    return {
      width: sizeBuffer[0],
      height: sizeBuffer[1]
    };
  }

  // Get Mat data wrapper
  static getMatData(mat: Mat, size: number): Float32Array {
    const buffer = new Float32Array(size);
    getSymbols().cv_get_mat_data(mat.ptr, ptr(buffer));
    return buffer;
  }
} 