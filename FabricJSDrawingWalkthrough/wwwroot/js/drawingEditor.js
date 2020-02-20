var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//The below code (and all of DrawingEditor) was originally developed 
//by my teammate Christopher Jestice (https://www.linkedin.com/in/christopher-jestice)
//Refinements are by me, Matthew Jones (https://exceptionnotfound.net).
class DrawingEditor {
    constructor(selector, canvasHeight, canvasWidth) {
        this.selector = selector;
        this.isObjectSelected = false;
        $(`#${selector}`).replaceWith(`<canvas id="${selector}" height=${canvasHeight} width=${canvasWidth}> </canvas>`);
        this.cursorMode = 0 /* Draw */;
        this.canvas = new fabric.Canvas(`${selector}`, { selection: false });
        this.drawers = [
            new LineDrawer(),
        ];
        this._drawer = this.drawers[0 /* Line */];
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
    set drawingMode(value) { this._drawer = this.drawers[value]; }
    initializeCanvasEvents() {
        this.canvas.on('mouse:down', (o) => {
            const e = o.e;
            const pointer = this.canvas.getPointer(o.e);
            this.mouseDown(pointer.x, pointer.y);
            this.isObjectSelected = this.canvas.getActiveObject() !== null;
        });
        this.canvas.on('mouse:move', (o) => {
            const pointer = this.canvas.getPointer(o.e);
            this.mouseMove(pointer.x, pointer.y);
        });
        this.canvas.on('mouse:over', (o) => {
            if (this.isDown || this.isObjectSelected || o.target === null) {
                return;
            }
            if (o.target != null && o.target.selectable) {
                this.canvas.setActiveObject(o.target);
                this.canvas.renderAll();
            }
        });
        this.canvas.on('mouse:out', (o) => {
            if (this.isObjectSelected) {
                return;
            }
            this.canvas.discardActiveObject().renderAll();
        });
        this.canvas.on('mouse:up', (o) => {
            this.isDown = false;
        });
        this.canvas.on('object:selected', (o) => {
            this.cursorMode = 1 /* Select */;
            //sets currently selected object
            this.object = o.target;
        });
        this.canvas.on('selection:cleared', (o) => {
            this.cursorMode = 0 /* Draw */;
        });
    }
    make(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._drawer.make(x, y, this.drawerOptions);
        });
    }
    mouseMove(x, y) {
        if (!(this.cursorMode.valueOf() === 0 /* Draw */.valueOf() && this.isDown)) {
            return;
        }
        this._drawer.resize(this.object, x, y);
        this.canvas.renderAll();
    }
    mouseDown(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isDown = true;
            if (this.cursorMode !== 0 /* Draw */) {
                return;
            }
            this.object = yield this.make(x, y);
            this.canvas.add(this.object);
            this.canvas.renderAll();
        });
    }
    addComponents(componentList) {
        componentList.forEach((item) => {
            this.addComponent(item.id, item.type);
        });
    }
    addComponent(target, component) {
        switch (component) {
            case 'line':
                this.components[component] = [new LineDisplayComponent(target, this)];
                break;
        }
    }
    componentSelected(componentName) {
        this.canvas.discardActiveObject();
        for (var key in this.components) {
            if (!this.components.hasOwnProperty(key))
                continue;
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
class DisplayComponent {
    constructor(mode, selector, parent, options) {
        this.drawingMode = mode;
        this.target = selector;
        this.hoverText = options.altText;
        this.svg = options.svg;
        this.canvasDrawer = parent;
        this.render();
        this.attachEvents();
    }
    //This method replaces the target HTML with the component's HTML.
    render() {
        const html = `<label id="${this.target.replace('#', '')}" 
                      class="btn btn-primary text-light" title="${this.hoverText}">
                        <input type="radio" name="options" autocomplete="off">
                        ${this.svg}
                      </label>`;
        $(this.target).replaceWith(html);
    }
    //This method attaches the componentSelected event in DrawingEditor
    attachEvents() {
        const data = {
            mode: this.drawingMode,
            container: this.canvasDrawer,
            target: this.target
        };
        // This long jQuery method chain is 
        // looking for the <input type="radio">
        // from the render() method.
        $(this.target).children().first().click(data, function () {
            data.container.drawingMode = data.mode;
            data.container.componentSelected(data.target);
        });
    }
    selectedChanged(componentName) { }
}
class DisplayComponentOptions {
}
class LineDisplayComponent extends DisplayComponent {
    constructor(target, parent) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Line',
            svg: `<svg width="13px" height="15px" viewBox="2 0 13 17">
                    <line x1="0" y1="13" x2="13" y2="0" stroke="white" stroke-width="2px" />
                  </svg>`
        });
        super(0 /* Line */, target, parent, options);
    }
}
