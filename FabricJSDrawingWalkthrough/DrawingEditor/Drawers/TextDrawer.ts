class TextDrawer implements IObjectDrawer {
    drawingMode: DrawingMode = DrawingMode.Text;

    make(x: number, y: number, options: fabric.IObjectOptions): Promise<fabric.Object> {
        const text = <HTMLInputElement>document.getElementById('textComponentInput');
        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Text(text.value, {
                left: x,
                top: y,
                ...options
            }));
        });
    }

    resize(object: fabric.Text, x: number, y: number): Promise<fabric.Object> {
        object.set({
            left: x,
            top: y
        }).setCoords();

        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}