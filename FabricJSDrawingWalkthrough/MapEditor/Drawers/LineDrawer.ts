class LineDrawer implements IObjectDrawer {
    drawingMode: DrawingMode = DrawingMode.Line;
    make(x: number, y: number, options: fabric.IObjectOptions, x2?: number, y2?: number): Promise<fabric.Object> {
        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Line([x, y, x2, y2], options));
        });
    }

    resize(object: fabric.Line, x: number, y: number): Promise<fabric.Object> {
        object.set({
            x2: x,
            y2: y
        }).setCoords();

        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}