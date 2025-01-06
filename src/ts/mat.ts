import { symbols } from './opencv_direct';
import type { CvSize } from './types';

export class Mat {
  readonly #ptr: number;

  constructor(ptr: number | null) {
    if (ptr === null) {
      throw new Error('Invalid Mat pointer');
    }
    this.#ptr = ptr;
  }

  get ptr(): number {
    return this.#ptr;
  }

  release(): void {
    symbols.cv_release_mat(this.#ptr as any);
  }

  getSize(): CvSize {
    const widthBuf = new Int32Array(1);
    const heightBuf = new Int32Array(1);
    symbols.cv_get_size(this.#ptr as any, widthBuf, heightBuf);
    return {
      width: widthBuf[0],
      height: heightBuf[0],
    };
  }

  async getData(buffer: Float32Array): Promise<void> {
    await symbols.cv_get_mat_data(this.#ptr as any, buffer);
  }
}
