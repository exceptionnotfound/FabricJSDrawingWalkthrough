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
            new TextDrawer(),
            new PolylineDrawer()
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
            case 'polyline':
                this.components[component] = [new PolylineDisplayComponent(target, this)];
                break;
            case 'delete':
                this.components[component] = [new DeleteComponent(target, this)];
                break;
            case 'lineColorChooser':
                this.components[component] = [
                    new ColorChooserComponent(target, this, '#000000', {
                        'change': (newColor) => {
                            this.setLineColor(newColor);
                        }
                    })
                ];
                break;
            case 'fillColorChooser':
                this.components[component] = [
                    new ColorChooserComponent(target, this, '', {
                        'change': (newColor) => {
                            this.setFillColor(newColor);
                        }
                    })
                ];
                break;
            case 'lineType':
                this.components[component] = [new LineTypeComponent(target, this)];
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
    setFillColor(color) {
        this.drawerOptions.fill = color;
    }
    setLineColor(color) {
        this.drawerOptions.stroke = color;
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
class PolylineDrawer {
    constructor() {
        this.drawingMode = 5 /* Polyline */;
    }
    make(x, y, options, rx, ry) {
        return new Promise(resolve => {
            resolve(new fabric.Polyline([{ x, y }], Object.assign(Object.assign({}, options), { fill: 'transparent' })));
        });
    }
    resize(object, x, y) {
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
class ImageDropdown {
    constructor(selector, options) {
        this.selector = selector;
        this.options = options;
        this.element = document.getElementById(this.selector);
        this.handlers = options.handlers;
        this.render();
        this.attachEvents();
    }
    render() {
        this.element.outerHTML =
            `<div id="${this.selector}" class='imageDropdown'>
                 <div style="width: ${this.options.width}px">
                    ${this.renderSelectedDiv()}
                    <i class="fa fa-caret-square-o-down" aria-hidden="true"></i>
                 </div>
                 <ul class="hidden" style="width: ${this.options.childWidth || this.options.width}px">
                    ${this.renderOptions()}                    
                 </ul>
             </div>`;
    }
    renderSelectedDiv() {
        switch (this.options.selectedStyle) {
            case 1 /* Copy */:
                return `<div id="${this.selector}_selected" style="width: ${this.options.width - 20}px">${this.options.optionsList[this.options.selectedIndex].display}</div>`;
            case 0 /* Fill */:
                return `<div id="${this.selector}_selected" style="width: ${this.options.width - 20}px; height:20px; background-color: ${this.options.optionsList[this.options.selectedIndex].value}"><span></span></div>`;
        }
    }
    renderOptions() {
        let output = '';
        this.options.optionsList.map((record) => {
            switch (this.options.selectedStyle) {
                case 1 /* Copy */:
                    output += `<li class="vertical" title="${record.text}">${record.display}</li>`;
                    break;
                case 0 /* Fill */:
                    output += `<li class="horizontal" title="${record.text}">${record.display}</li>`;
                    break;
            }
        });
        return output;
    }
    attachEvents() {
        this.element = document.getElementById(this.selector);
        const container = this;
        const selectedDiv = this.element.children[0];
        const list = this.element.children[1];
        const options = [...list.children];
        selectedDiv.addEventListener('click', () => {
            if (list.classList.contains('hidden'))
                list.classList.remove('hidden');
            else
                list.classList.add('hidden');
        });
        options.forEach((element, index) => {
            element.addEventListener('click', (o) => {
                const selected = this.options.optionsList[index];
                list.classList.add('hidden');
                //Update value and display
                if (container.value != selected.value) {
                    switch (container.options.selectedStyle) {
                        case 1 /* Copy */:
                            selectedDiv.children[0].innerHTML = selected.display;
                            container.value = selected.value;
                            break;
                        case 0 /* Fill */:
                            Object.assign(selectedDiv.children[0].style, {
                                backgroundColor: selected.value
                            });
                            container.value = selected.value;
                            break;
                    }
                    if (container.handlers['change'] != null) {
                        container.handlers['change'](this.value);
                    }
                }
            });
        });
    }
}
class ImageDropdownOptions {
}
class ImageOption {
}
class ColorChooserComponent {
    constructor(target, parent, defaultColor, handlers) {
        this.target = target;
        this.parent = parent;
        this.defaultColor = defaultColor;
        this.handlers = handlers;
        this.colors = [
            { key: 0, code: '', text: 'Transparent' },
            { key: 1, code: '#FFFFFF', text: 'White' },
            { key: 2, code: '#C0C0C0', text: 'Silver' },
            { key: 3, code: '#808080', text: 'Gray' },
            { key: 4, code: '#000000', text: 'Black' },
            { key: 5, code: '#FF0000', text: 'Red' },
            { key: 6, code: '#800000', text: 'Maroon' },
            { key: 7, code: '#FFFF00', text: 'Yellow' },
            { key: 8, code: '#808000', text: 'Olive' },
            { key: 9, code: '#00FF00', text: 'Lime' },
            { key: 10, code: '#008000', text: 'Green' },
            { key: 11, code: '#00FFFF', text: 'Aqua' },
            { key: 12, code: '#008080', text: 'Teal' },
            { key: 13, code: '#0000FF', text: 'Blue' },
            { key: 14, code: '#000080', text: 'Navy' },
            { key: 15, code: '#FF00FF', text: 'Fuchsia' },
            { key: 16, code: '#800080', text: 'Purple' }
        ];
        this.render();
    }
    render() {
        var opt = new ImageDropdownOptions();
        const def = this.colors.filter((c) => {
            if (c.code === this.defaultColor)
                return c;
        });
        Object.assign(opt, {
            selectedStyle: 0 /* Fill */,
            selectedIndex: def[0].key,
            width: 50,
            childWidth: 153,
            optionsList: this.getOptions(),
            handlers: this.handlers
        });
        new ImageDropdown(this.target, opt);
    }
    getOptions() {
        const values = [];
        this.colors.forEach((color) => {
            const fillColor = color.code === '' ? 'none' : color.code;
            values.push({
                display: `<svg width="16px" height="15px" viewBox="0 0 15 15"><rect width="15" height="15" top="0" fill="${fillColor}" stroke="black" stroke-width="1px" /></svg>`,
                value: color.code,
                text: color.text
            });
        });
        return values;
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
class LineTypeComponent {
    constructor(target, parent) {
        this.target = target;
        this.parent = parent;
        this.render();
    }
    render() {
        var opt = new ImageDropdownOptions();
        Object.assign(opt, {
            selectedStyle: 1 /* Copy */,
            selectedIndex: 0,
            width: 50,
            optionsList: [
                {
                    display: '<svg width="50px" height="10px" viewBox="0 0 50 10"><line x1="1" y1="1" x2="50" y2="1" stroke="black" stroke-width="3px" /></svg>',
                    value: 'solid',
                    text: 'Solid'
                },
                {
                    display: '<svg width="50px" height="10px" viewBox="0 0 50 10"><line x1="3" y1="1" x2="50" y2="1" stroke="black" stroke-linecap="round" stroke-width="3px" stroke-dasharray="1 6" /></svg>',
                    value: 'dotted',
                    text: 'Dotted'
                },
                {
                    display: '<svg width="50px" height="10px" viewBox="0 0 50 10"><line x1="3" y1="1" x2="50" y2="1" stroke="black" stroke-width="3px" stroke-dasharray="6 6" /></svg>',
                    value: 'dashed',
                    text: 'Dashed'
                }
            ],
            handlers: {
                'change': (lineType) => {
                    this.selectedType = lineType;
                    this.update();
                }
            }
        });
        new ImageDropdown(this.target, opt);
    }
    update() {
        switch (this.selectedType) {
            case 'solid':
                delete this.parent.drawerOptions.strokeLineCap;
                delete this.parent.drawerOptions.strokeDashArray;
                break;
            case 'dotted':
                this.parent.drawerOptions.strokeLineCap = 'round';
                this.parent.drawerOptions.strokeDashArray = [1, this.parent.drawerOptions.strokeWidth * 2];
                break;
            case 'dashed':
                delete this.parent.drawerOptions.strokeLineCap;
                this.parent.drawerOptions.strokeDashArray = [this.parent.drawerOptions.strokeWidth * 2, this.parent.drawerOptions.strokeWidth * 1.5];
                break;
        }
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
class PolylineDisplayComponent extends DisplayComponent {
    constructor(target, parent) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Pencil',
            classNames: 'fa fa-pencil',
            childName: null
        });
        super(5 /* Polyline */, target, parent, options);
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
