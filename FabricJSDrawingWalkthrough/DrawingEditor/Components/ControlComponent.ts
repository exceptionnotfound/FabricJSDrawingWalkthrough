abstract class ControlComponent {
    target: string; //Selector for the component's render location
    cssClass: string; //CSS classes for icons
    hoverText: string; //Tooltip text
    canvassDrawer: DrawingEditor;
    handlers: { [key: string]: () => void };

    constructor(selector: string, classNames: string, altText: string, parent: DrawingEditor, handlers: { [key: string]: () => void }) {
        this.target = selector;
        this.cssClass = classNames;
        this.hoverText = altText;
        this.canvassDrawer = parent;
        this.render();
        this.handlers = handlers;
        this.attachEvents();
    }

    abstract render();

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