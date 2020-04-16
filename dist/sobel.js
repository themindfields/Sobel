"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sobel = function (image, applyBlur) {
    if (applyBlur === void 0) { applyBlur = true; }
    var BLUR_KERNEL_SIZE = 5;
    var BLUR_VALUE = 1 / Math.pow(BLUR_KERNEL_SIZE, 2);
    var blurKernel = Array(Math.pow(BLUR_KERNEL_SIZE, 2)).fill(BLUR_VALUE);
    var sobelXKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    var sobelYKernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    var imagePixels = __spreadArrays(image.data);
    var width = image.width;
    var height = image.height;
    var data = new Array();
    var imageDataLength = imagePixels.length;
    var getPixel = function (x, y) {
        if (x < 0) {
            x = Math.abs(x);
        }
        else if (x > width - 1) {
            x = 2 * (width - 1) - x;
        }
        if (y < 0) {
            y = Math.abs(y);
        }
        else if (y > height - 1) {
            y = 2 * (height - 1) - y;
        }
        return imagePixels[width * y + x];
    };
    var saturateCast = function (value) {
        if (value > 255) {
            return 255;
        }
        if (value < 0) {
            return 0;
        }
        return Math.floor(value);
    };
    if (applyBlur) {
        var upperBound = Math.floor(BLUR_KERNEL_SIZE / 2);
        var lowerBound = -upperBound;
        for (var index = 0; index < imageDataLength; ++index) {
            var x = index % width;
            var y = Math.floor(index / width);
            var pixel = 0;
            var kernelIndex = 0;
            for (var i = lowerBound; i <= upperBound; ++i) {
                for (var j = lowerBound; j <= upperBound; ++j) {
                    pixel += blurKernel[kernelIndex] * getPixel(x + i, y + j);
                    ++kernelIndex;
                }
            }
            imagePixels[index] = pixel;
        }
    }
    for (var index = 0; index < imageDataLength; ++index) {
        var x = index % width;
        var y = Math.floor(index / width);
        var pixelX = sobelXKernel[0] * getPixel(x - 1, y - 1) +
            sobelXKernel[2] * getPixel(x + 1, y - 1) +
            sobelXKernel[3] * getPixel(x - 1, y) +
            sobelXKernel[5] * getPixel(x + 1, y) +
            sobelXKernel[6] * getPixel(x - 1, y + 1) +
            sobelXKernel[8] * getPixel(x + 1, y + 1);
        var pixelY = sobelYKernel[0] * getPixel(x - 1, y - 1) +
            sobelYKernel[1] * getPixel(x, y - 1) +
            sobelYKernel[2] * getPixel(x + 1, y - 1) +
            sobelYKernel[6] * getPixel(x - 1, y + 1) +
            sobelYKernel[7] * getPixel(x, y + 1) +
            sobelYKernel[8] * getPixel(x + 1, y + 1);
        var pixel = (Math.abs(pixelX) + Math.abs(pixelY)) / 2;
        data.push(saturateCast(pixel));
    }
    return Object.freeze({
        width: width,
        height: height,
        data: data
    });
};
exports.sobel = sobel;
