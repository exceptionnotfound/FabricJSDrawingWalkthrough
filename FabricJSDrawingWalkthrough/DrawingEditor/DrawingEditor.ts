//The below code (and all of DrawingEditor) was 
//originally developed by my teammate Christopher Jestice.
//Refinements are by me, Matthew Jones (Exception Not Found).

class DrawingEditor {
    canvas: fabric.Canvas;

    //private _drawer: IObjectDrawer;
    //readonly drawerOptions: fabric.IObjectOptions;
    //private readonly drawers: IObjectDrawer[];
    //private isDown: boolean;
    //private isObjectSelected: boolean = false;
    //private object: fabric.Object;

    constructor(private readonly selector: string, canvasHeight: number, canvasWidth: number) {
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

    //private initializeCanvasEvents() {
    //    this.canvas.on('mouse:down', (o) => {
    //        const e = <MouseEvent>o.e;

    //        const pointer = this.canvas.getPointer(o.e);
    //        this.mouseDown(pointer.x, pointer.y);
    //    });

    //    this.canvas.on('mouse:move', (o) => {
    //        const pointer = this.canvas.getPointer(o.e);
    //        this.mouseMove(pointer.x, pointer.y);
    //    });

    //    this.canvas.on('mouse:over', (o) => {
    //        if (this.isDown || this.isObjectSelected || o.target === null) { return; }

    //        if (o.target != null && o.target.selectable) {
    //            this.canvas.setActiveObject(o.target);
    //            this.canvas.renderAll();
    //        }
    //    });

    //    this.canvas.on('mouse:out', (o) => {
    //        if (this.isObjectSelected) { return; }

    //        this.canvas.discardActiveObject().renderAll();
    //    });

    //    this.canvas.on('mouse:up', (o) => {
    //        this.isDown = false;
    //    });
    //}

    //private async make(x: number, y: number): Promise<fabric.Object> {
    //    return await this._drawer.make(x, y, this.drawerOptions);
    //}

    //private mouseMove(x: number, y: number): any {
    //    if (!this.isDown) {
    //        return;
    //    }
    //    this._drawer.resize(this.object, x, y);
    //    this.canvas.renderAll();
    //}  

    //private async mouseDown(x: number, y: number): Promise<any> {
    //    this.isDown = true;

    //    this.object = await this.make(x, y);
    //    this.canvas.add(this.object);
    //    this.canvas.renderAll();
    //}
}