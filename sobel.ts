interface ImageRepresentation {
  readonly width: number;
  readonly height: number;
  readonly data: number[];
}

const sobel = (image: ImageRepresentation, applyBlur: boolean = true): ImageRepresentation => {
  const BLUR_KERNEL_SIZE = 5;
  const BLUR_VALUE = 1 / BLUR_KERNEL_SIZE ** 2;
  const blurKernel = Array(BLUR_KERNEL_SIZE ** 2).fill(BLUR_VALUE);
  const sobelXKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelYKernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const imagePixels = [...image.data];
  const width = image.width;
  const height = image.height;
  const data = new Array();
  const imageDataLength = imagePixels.length;

  const getPixel = (x: number, y: number): number => {
    if (x < 0) {
      x = Math.abs(x);
    } else if (x > width - 1) {
      x = 2 * (width - 1) - x;
    }

    if (y < 0) {
      y = Math.abs(y);
    } else if (y > height - 1) {
      y = 2 * (height - 1) - y;
    }

    return imagePixels[width * y + x];
  };

  const saturateCast = (value: number): number => {
    if (value > 255) {
      return 255;
    }
    if (value < 0) {
      return 0;
    }

    return Math.floor(value);
  };

  if (applyBlur) {
    const upperBound = Math.floor(BLUR_KERNEL_SIZE / 2);
    const lowerBound = -upperBound;
    for (let index = 0; index < imageDataLength; ++index) {
      const x = index % width;
      const y = Math.floor(index / width);
      let pixel = 0;
      let kernelIndex = 0;
      for (let i = lowerBound; i <= upperBound; ++i) {
        for (let j = lowerBound; j <= upperBound; ++j) {
          pixel += blurKernel[kernelIndex] * getPixel(x + i, y + j);
          ++kernelIndex;
        }
      }
      imagePixels[index] = pixel;
    }
  }

  for (let index = 0; index < imageDataLength; ++index) {
    const x = index % width;
    const y = Math.floor(index / width);
    const pixelX =
      sobelXKernel[0] * getPixel(x - 1, y - 1) +
      sobelXKernel[2] * getPixel(x + 1, y - 1) +
      sobelXKernel[3] * getPixel(x - 1, y) +
      sobelXKernel[5] * getPixel(x + 1, y) +
      sobelXKernel[6] * getPixel(x - 1, y + 1) +
      sobelXKernel[8] * getPixel(x + 1, y + 1);
    const pixelY =
      sobelYKernel[0] * getPixel(x - 1, y - 1) +
      sobelYKernel[1] * getPixel(x, y - 1) +
      sobelYKernel[2] * getPixel(x + 1, y - 1) +
      sobelYKernel[6] * getPixel(x - 1, y + 1) +
      sobelYKernel[7] * getPixel(x, y + 1) +
      sobelYKernel[8] * getPixel(x + 1, y + 1);
    const pixel = (Math.abs(pixelX) + Math.abs(pixelY)) / 2;
    data.push(saturateCast(pixel));
  }

  return Object.freeze({
    width,
    height,
    data
  });
};

export { sobel };
