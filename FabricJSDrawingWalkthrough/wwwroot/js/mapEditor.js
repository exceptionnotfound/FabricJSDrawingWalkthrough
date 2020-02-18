class MapEditor {
    //private _drawer: IObjectDrawer;
    //readonly drawerOptions: fabric.IObjectOptions;
    //private readonly drawers: IObjectDrawer[];
    //private isDown: boolean;
    //private isObjectSelected: boolean = false;
    //private object: fabric.Object;
    constructor(selector, canvasHeight, canvasWidth) {
        this.selector = selector;
        $(`#${selector}`).replaceWith(`<canvas id="${selector}" height=${canvasHeight} width=${canvasWidth}> </canvas>`);
        this.canvas = new fabric.Canvas(`${selector}`, { selection: false });
        //this.drawers = [
        //    new LineDrawer(),
        //];
        //this._drawer = this.drawers[DrawingMode.Line];
        //this.isDown = false;
        //this.drawerOptions = {
        //    stroke: 'black',
        //    strokeWidth: 1,
        //    selectable: true,
        //    strokeUniform: true
        //};
        //this.initializeCanvasEvents();
    }
}
class LineDrawer {
    constructor() {
        this.drawingMode = 0 /* Line */;
    }
    make(x, y, options, x2, y2) {
        return new Promise(resolve => {
            resolve(new fabric.Line([x, y, x2, y2], options));
        });
    }
    resize(object, x, y) {
        object.set({
            x2: x,
            y2: y
        }).setCoords();
        return new Promise(resolve => {
            resolve(object);
        });
    }
}
