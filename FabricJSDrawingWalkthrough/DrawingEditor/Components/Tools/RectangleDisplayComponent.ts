class RectangleDisplayComponent extends DisplayComponent {
    constructor(target: string, parent: DrawingEditor) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Rectangle',
            classNames: 'fa fa-square-o',
            childName: null
        });
        super(DrawingMode.Rectangle, target, parent, options);
    }
}