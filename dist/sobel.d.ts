interface ImageRepresentation {
    readonly width: number;
    readonly height: number;
    readonly data: number[];
}
declare const sobel: (image: ImageRepresentation, applyBlur?: boolean) => ImageRepresentation;
export { sobel };
