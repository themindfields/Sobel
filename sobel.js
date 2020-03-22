(function(root) {
  'use strict';

  function Sobel(imageData) {
    if (!(this instanceof Sobel)) {
      return new Sobel(imageData);
    }

    var width = imageData.width;
    var height = imageData.height;

    // var kernelX = [
    //   [-1,0,1],
    //   [-2,0,2],
    //   [-1,0,1]
    // ];
    var kernelX = [
      [-3, 0, 3],
      [-10, 0, 10],
      [-3, 0, 3]
    ];

    // var kernelY = [
    //   [-1,-2,-1],
    //   [0,0,0],
    //   [1,2,1]
    // ];
    var kernelY = [
      [-3, -10, -3],
      [0, 0, 0],
      [3, 10, 3]
    ];

    var sobelData = [];

    function bindPixelAt(data) {
      return function(x, y) {
        return data[((width * y) + x)];
      };
    }

    var data = imageData.data;
    var pixelAt = bindPixelAt(data);
    var x, y;

    // for (y = 0; y < height; y++) {
    //   for (x = 0; x < width; x++) {
    //     var r = pixelAt(x, y, 0);
    //     var g = pixelAt(x, y, 1);
    //     var b = pixelAt(x, y, 2);

    //     var avg = (r + g + b) / 3;
    //     grayscaleData.push(avg, avg, avg, 255);
    //     // grayscaleData.push(avg);

    //   }
    // }

    pixelAt = bindPixelAt(data);

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var pixelX = (
            (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
            (kernelX[0][1] * pixelAt(x, y - 1)) +
            (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
            (kernelX[1][0] * pixelAt(x - 1, y)) +
            (kernelX[1][1] * pixelAt(x, y)) +
            (kernelX[1][2] * pixelAt(x + 1, y)) +
            (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
            (kernelX[2][1] * pixelAt(x, y + 1)) +
            (kernelX[2][2] * pixelAt(x + 1, y + 1))
        );

        var pixelY = (
          (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
          (kernelY[0][1] * pixelAt(x, y - 1)) +
          (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
          (kernelY[1][0] * pixelAt(x - 1, y)) +
          (kernelY[1][1] * pixelAt(x, y)) +
          (kernelY[1][2] * pixelAt(x + 1, y)) +
          (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
          (kernelY[2][1] * pixelAt(x, y + 1)) +
          (kernelY[2][2] * pixelAt(x + 1, y + 1))
        );

        function saturate_cast(value) {
          if(value < 0 ) {return 0;}
          else if(value > 255) {return 255;}
          else {return Math.round(value);}
        }
        
        // var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
    
        var scaledX = saturate_cast(Math.abs(pixelX));
        var scaledY = saturate_cast(Math.abs(pixelY));
        var magnitude = saturate_cast(scaledX * 0.5) + saturate_cast(scaledY * 0.5);
        sobelData.push(magnitude);
      }
    }

    function getMax(arr){
      let len = arr.length;
      let max = -Infinity;

      while(len--){
        max = arr[len] > max ? arr[len] : max;
      }
      return max;
    }

    var clampedArray = sobelData;
    var max = getMax(clampedArray);


    if (typeof Uint8ClampedArray === 'function') {
      clampedArray = new Uint8ClampedArray(sobelData);
    }

    clampedArray.toImageData = function() {
      return Sobel.toImageData(clampedArray, width, height);
    };

    return clampedArray;
  }

  Sobel.toImageData = function toImageData(data, width, height) {
    if (typeof ImageData === 'function' && Object.prototype.toString.call(data) === '[object Uint16Array]') {
      return new ImageData(data, width, height);
    } else {
      if (typeof window === 'object' && typeof window.document === 'object') {
        var canvas = document.createElement('canvas');

        if (typeof canvas.getContext === 'function') {
          var context = canvas.getContext('2d');
          var imageData = context.createImageData(width, height);
          imageData.data.set(data);
          return imageData;
        } else {
          return new FakeImageData(data, width, height);
        }
      } else {
        return new FakeImageData(data, width, height);
      }
    }
  };

  function FakeImageData(data, width, height) {
    return {
      width: width,
      height: height,
      data: data
    };
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Sobel;
    }
    exports.Sobel = Sobel;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Sobel;
    });
  } else {
    root.Sobel = Sobel;
  }

})(this);