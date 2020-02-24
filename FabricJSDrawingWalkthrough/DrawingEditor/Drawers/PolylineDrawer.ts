class PolylineDrawer implements IObjectDrawer {
    drawingMode: DrawingMode = DrawingMode.Polyline;

    make(x: number, y: number, options: fabric.IObjectOptions, rx?: number, ry?: number): Promise<fabric.Object> {
        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Polyline(
                [{ x, y }],
                { ...options, fill: 'transparent' }
            ));
        });
    }

    resize(object: fabric.Polyline, x: number, y: number): Promise<fabric.Object> {
        object.points.push(new fabric.Point(x, y));
        const dim = object._calcDimensions();

        object.set({
            left: dim.left,
            top: dim.top,
            width: dim.width,
            height: dim.height,
            dirty: true,
            pathOffset: new fabric.Point(dim.left + dim.width / 2, dim.top + dim.height / 2)

        }).setCoords();

        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}