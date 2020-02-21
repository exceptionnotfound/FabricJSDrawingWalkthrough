class DisplayComponent {
    drawingMode: DrawingMode; //Line, Rectangle, Oval, etc.
    target: string; //The selector for the HTML element this Component
                    //will be rendered in
    hoverText: string; //The tooltip text
    svg: string; //The SVG for the component's icon
    cssClass: string; //CSS class for the FontAwesome icon used by this display component
    childName: string; //Selector for the child element; only used by text components.
    canvasDrawer: DrawingEditor;

    constructor(mode: DrawingMode, selector: string, parent: DrawingEditor, options: DisplayComponentOptions) {
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

    private iconStr(): string {
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

    selectedChanged(componentName: string) { }
}

class DisplayComponentOptions {
    altText: string;
    svg?: string;
    classNames?: string;
    childName?: string;
}