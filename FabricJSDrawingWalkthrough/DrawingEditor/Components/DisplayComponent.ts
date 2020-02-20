class DisplayComponent {
    drawingMode: DrawingMode; //Draw or Select
    target: string; //The selector for the HTML element this Component
                    //will be rendered in
    hoverText: string; //The tooltip text
    svg: string; //The SVG for the component's icon
    canvasDrawer: DrawingEditor;

    constructor(mode: DrawingMode, selector: string, parent: DrawingEditor, options: DisplayComponentOptions) {
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

    selectedChanged(componentName: string) { }
}

class DisplayComponentOptions {
    altText: string;
    svg?: string;
}