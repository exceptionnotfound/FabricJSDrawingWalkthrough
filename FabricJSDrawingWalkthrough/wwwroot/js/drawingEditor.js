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
        this.components = [];
        this.drawers = [
            new LineDrawer(),
            new RectangleDrawer(),
            new OvalDrawer(),
            new TriangleDrawer(),
            new TextDrawer()
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
            if (this.components['delete'] !== undefined) {
                this.components['delete'][0].enable();
            }
        });
        this.canvas.on('selection:cleared', (o) => {
            if (this.components['delete'] !== undefined) {
                this.components['delete'][0].disable();
            }
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
            case 'rect':
                this.components[component] = [new RectangleDisplayComponent(target, this)];
                break;
            case 'oval':
                this.components[component] = [new OvalDisplayComponent(target, this)];
                break;
            case 'tria':
                this.components[component] = [new TriangleDisplayComponent(target, this)];
                break;
            case 'text':
                this.components[component] = [new TextDisplayComponent(target, this)];
                break;
            case 'delete':
                this.components[component] = [new DeleteComponent(target, this)];
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
    deleteSelected() {
        const obj = this.canvas.getActiveObject();
        this.canvas.remove(this.canvas.getActiveObject());
        this.canvas.renderAll();
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
class RectangleDrawer {
    constructor() {
        this.drawingMode = 1 /* Rectangle */;
    }
    make(x, y, options, width, height) {
        this.origX = x;
        this.origY = y;
        return new Promise(resolve => {
            resolve(new fabric.Rect(Object.assign({ left: x, top: y, width: width, height: height, fill: 'transparent' }, options)));
        });
    }
    resize(object, x, y) {
        object.set({
            originX: this.origX > x ? 'right' : 'left',
            originY: this.origY > y ? 'bottom' : 'top',
            width: Math.abs(this.origX - x),
            height: Math.abs(this.origY - y),
        }).setCoords();
        return new Promise(resolve => {
            resolve(object);
        });
    }
}
class OvalDrawer {
    constructor() {
        this.drawingMode = 2 /* Oval */;
    }
    make(x, y, options, rx, ry) {
        this.origX = x;
        this.origY = y;
        return new Promise(resolve => {
            resolve(new fabric.Ellipse(Object.assign({ left: x, top: y, rx: rx, ry: ry, fill: 'transparent' }, options)));
        });
    }
    resize(object, x, y) {
        object.set({
            originX: this.origX > x ? 'right' : 'left',
            originY: this.origY > y ? 'bottom' : 'top',
            rx: Math.abs(x - object.left) / 2,
            ry: Math.abs(y - object.top) / 2
        }).setCoords();
        return new Promise(resolve => {
            resolve(object);
        });
    }
}
class TriangleDrawer {
    constructor() {
        this.drawingMode = 3 /* Triangle */;
    }
    make(x, y, options, width, height) {
        this.origX = x;
        this.origY = y;
        return new Promise(resolve => {
            resolve(new fabric.Triangle(Object.assign({ left: x, top: y, width: width, height: height, fill: 'transparent' }, options)));
        });
    }
    resize(object, x, y) {
        object.set({
            originX: this.origX > x ? 'right' : 'left',
            originY: this.origY > y ? 'bottom' : 'top',
            width: Math.abs(this.origX - x),
            height: Math.abs(this.origY - y),
        }).setCoords();
        return new Promise(resolve => {
            resolve(object);
        });
    }
}
class TextDrawer {
    constructor() {
        this.drawingMode = 4 /* Text */;
    }
    make(x, y, options) {
        const text = document.getElementById('textComponentInput');
        return new Promise(resolve => {
            resolve(new fabric.Text(text.value, Object.assign({ left: x, top: y }, options)));
        });
    }
    resize(object, x, y) {
        object.set({
            left: x,
            top: y
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
        this.cssClass = options.classNames;
        this.hoverText = options.altText;
        this.svg = options.svg;
        this.childName = options.childName;
        this.canvasDrawer = parent;
        this.render();
        this.attachEvents();
    }
    //This method replaces the target HTML with the component's HTML.
    //The radio button is included to have Bootstrap use the correct styles.
    render() {
        const html = `<label id="${this.target.replace('#', '')}" class="btn btn-primary text-light " title="${this.hoverText}">
                        <input type="radio" name="options" autocomplete="off"> ${this.iconStr()}
                     </label>`;
        $(this.target).replaceWith(html);
    }
    iconStr() {
        if (this.cssClass != null) {
            return `<i class="${this.cssClass}"></i>`;
        }
        else {
            return this.svg;
        }
    }
    //This method attaches the componentSelected event in DrawingEditor
    attachEvents() {
        const data = {
            mode: this.drawingMode,
            container: this.canvasDrawer,
            target: this.target
        };
        //When clicking the <label>, fire this event.
        $(this.target).click(data, function () {
            data.container.drawingMode = data.mode;
            data.container.componentSelected(data.target);
        });
    }
    selectedChanged(componentName) { }
}
class DisplayComponentOptions {
}
class ControlComponent {
    constructor(selector, classNames, altText, parent, handlers) {
        this.target = selector;
        this.cssClass = classNames;
        this.hoverText = altText;
        this.canvassDrawer = parent;
        this.render();
        this.handlers = handlers;
        this.attachEvents();
    }
    attachEvents() {
        if (this.handlers['click'] != null) {
            $(this.target).click(this, () => {
                this.handlers['click']();
            });
        }
        if (this.handlers['change'] != null) {
            $(this.target).change(this, () => {
                this.handlers['change']();
            });
        }
    }
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
class RectangleDisplayComponent extends DisplayComponent {
    constructor(target, parent) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Rectangle',
            classNames: 'fa fa-square-o',
            childName: null
        });
        super(1 /* Rectangle */, target, parent, options);
    }
}
class OvalDisplayComponent extends DisplayComponent {
    constructor(target, parent) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Oval',
            classNames: 'fa fa-circle-o',
            childName: null
        });
        super(2 /* Oval */, target, parent, options);
    }
}
class TriangleDisplayComponent extends DisplayComponent {
    constructor(target, parent) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Triangle',
            svg: `<svg width="13px" height="15px" viewBox="0 0 20 20">
                    <line x1="0" y1="20" x2="10" y2="0" stroke="white" stroke-width="2px" />
                    <line x1="10" y1="0" x2="20" y2="20" stroke="white" stroke-width="2px" />
                    <line x1="0" y1="20" x2="20" y2="20" stroke="white" stroke-width="2px" />
                  </svg>`,
        });
        super(3 /* Triangle */, target, parent, options);
    }
}
class TextDisplayComponent extends DisplayComponent {
    constructor(target, parent) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Text',
            classNames: 'fa fa-font',
            childName: 'textComponentInput'
        });
        super(4 /* Text */, target, parent, options);
    }
    render() {
        super.render();
        //We need to render a hidden textbox next to the text button.
        $(this.target).parent().append(`<input id="${this.childName}" class="col-sm-6 form-control hidden" />`);
    }
    //Show the textbox if the text button is selected
    selectionUpdated(newTarget) {
        $(newTarget).removeClass('hidden');
    }
    selectedChanged(componentName) {
        //If the text button is selected, show the textbox
        if (componentName === this.target) {
            $(`#${this.childName}`).removeClass('hidden');
        }
        //Otherwise, hide the textbox.
        else {
            $(`#${this.childName}`).addClass('hidden').val('');
        }
    }
}
class DeleteComponent extends ControlComponent {
    constructor(target, parent) {
        super(target, "fa fa-trash-o", //CSS class for icons
        "Delete Selected Item", //Tooltip text
        parent, {
            //The component invokes a method on DrawingEditor to delete selected objects.
            'click': () => { parent.deleteSelected(); }
        });
    }
    //Render a button with a trash can icon
    render() {
        const html = `<button id="${this.target.replace('#', '')}" title="${this.hoverText}" disabled class="btn btn-danger">
                        <i class="${this.cssClass}"></i>
                     </button>`;
        $(this.target).replaceWith(html);
    }
    //Enable the button
    enable() {
        var ele = document.getElementById(this.target.replace('#', ''));
        Object.assign(ele, {
            disabled: false
        });
    }
    //Disable the button
    disable() {
        var ele = document.getElementById(this.target.replace('#', ''));
        Object.assign(ele, {
            disabled: true
        });
    }
}
