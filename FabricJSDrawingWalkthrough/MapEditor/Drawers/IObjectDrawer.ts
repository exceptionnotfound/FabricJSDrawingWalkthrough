interface IObjectDrawer {
    drawingMode: DrawingMode;
    readonly make: (x: number, y: number, options: fabric.IObjectOptions, x2?: number, y2?: number) => Promise<fabric.Object>;
    readonly resize: (object: fabric.Object, x: number, y: number) => Promise<fabric.Object>;
}