class TriangleDrawer implements IObjectDrawer {
    private origX: number;
    private origY: number;

    drawingMode: DrawingMode = DrawingMode.Triangle;

    make(x: number, y: number, options: fabric.IObjectOptions, width?: number, height?: number): Promise<fabric.Object> {
        this.origX = x;
        this.origY = y;

        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Triangle({
                left: x,
                top: y,
                width: width,
                height: height,
                fill: 'transparent',
                ...options
            }));
        });
    }

    resize(object: fabric.Triangle, x: number, y: number): Promise<fabric.Object> {
        object.set({
            originX: this.origX > x ? 'right' : 'left',
            originY: this.origY > y ? 'bottom' : 'top',
            width: Math.abs(this.origX - x),
            height: Math.abs(this.origY - y),
        }).setCoords();

        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}