//The below code (and all of DrawingEditor) was originally developed 
//by my teammate Christopher Jestice (https://www.linkedin.com/in/christopher-jestice)
//Refinements are by me, Matthew Jones (https://exceptionnotfound.net).

class DrawingEditor {
    canvas: fabric.Canvas;

    private components: DisplayComponent[];
    private cursorMode: CursorMode;
    private _drawer: IObjectDrawer;
    readonly drawerOptions: fabric.IObjectOptions;
    private readonly drawers: IObjectDrawer[];
    private isDown: boolean;
    private isObjectSelected: boolean = false;
    private object: fabric.Object;

    constructor(private readonly selector: string,
        canvasHeight: number, canvasWidth: number) {
        $(`#${selector}`).replaceWith(`<canvas id="${selector}" height=${canvasHeight} width=${canvasWidth}> </canvas>`);

        this.cursorMode = CursorMode.Draw;

        this.canvas = new fabric.Canvas(`${selector}`, { selection: false });

        this.components = [];

        this.drawers = [
            new LineDrawer(),
            new RectangleDrawer(),
            new OvalDrawer(),
            new TriangleDrawer()
        ];
        this._drawer = this.drawers[DrawingMode.Line];
        this.drawerOptions = {
            stroke: 'black',
            strokeWidth: 1,
            selectable: true,
            strokeUniform: true
        };

        this.isDown = false;

        this.initializeCanvasEvents();
    }

    //Properties
    get drawingMode() { return this._drawer.drawingMode; }

    set drawingMode(value: DrawingMode) { this._drawer = this.drawers[value]; }

    private initializeCanvasEvents() {
        this.canvas.on('mouse:down', (o) => {
            const e = <MouseEvent>o.e;

            const pointer = this.canvas.getPointer(o.e);
            this.mouseDown(pointer.x, pointer.y);
            this.isObjectSelected = this.canvas.getActiveObject() !== null;
        });

        this.canvas.on('mouse:move', (o) => {
            const pointer = this.canvas.getPointer(o.e);
            this.mouseMove(pointer.x, pointer.y);
        });

        this.canvas.on('mouse:over', (o) => {
            if (this.isDown || this.isObjectSelected || o.target === null) { return; }

            if (o.target != null && o.target.selectable) {
                this.canvas.setActiveObject(o.target);
                this.canvas.renderAll();
            }
        });

        this.canvas.on('mouse:out', (o) => {
            if (this.isObjectSelected) { return; }

            this.canvas.discardActiveObject().renderAll();
        });

        this.canvas.on('mouse:up', (o) => {
            this.isDown = false;
        });

        this.canvas.on('object:selected', (o) => {
            this.cursorMode = CursorMode.Select;
            //sets currently selected object
            this.object = o.target;
        });

        this.canvas.on('selection:cleared', (o) => {
            this.cursorMode = CursorMode.Draw;
        });
    }

    private async make(x: number, y: number): Promise<fabric.Object> {
        return await this._drawer.make(x, y, this.drawerOptions);
    }

    private mouseMove(x: number, y: number): any {
        if (!(this.cursorMode.valueOf() === CursorMode.Draw.valueOf() && this.isDown)) {
            return;
        }
        this._drawer.resize(this.object, x, y);
        this.canvas.renderAll();
    }  

    private async mouseDown(x: number, y: number): Promise<any> {
        this.isDown = true;

        if (this.cursorMode !== CursorMode.Draw) {
            return;
        }

        this.object = await this.make(x, y);
        this.canvas.add(this.object);
        this.canvas.renderAll();
    }

    addComponents(componentList: [{ id: string, type: string }]) {
        componentList.forEach((item) => {
            this.addComponent(item.id, item.type);
        });
    }

    addComponent(target: string, component: string) {
        switch (component) {
            case 'line':
                this.components[component] = [new LineDisplayComponent(target, this)];
                break;
            case 'rect':
                this.components[component] = [new RectangleDisplayComponent(target, this)];
                break;
            case 'oval':
                this.components[component] = [new OvalDisplayComponent(target, this)];
                break;
            case 'tria':
                this.components[component] = [new TriangleDisplayComponent(target, this)];
                break;
        }
    }

    componentSelected(componentName: string) {
        this.canvas.discardActiveObject();
        for (var key in this.components) {
            if (!this.components.hasOwnProperty(key)) continue;

            const obj = this.components[key];

            if (obj[0].target === componentName) {
                this.drawingMode = obj[0].drawingMode;
            }

            //Not all types have a selectedChanged event
            if (obj[0].selectedChanged !== undefined)
                obj[0].selectedChanged(componentName);
        }
    }
}