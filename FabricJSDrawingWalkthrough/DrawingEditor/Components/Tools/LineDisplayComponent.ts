class LineDisplayComponent extends DisplayComponent {
    constructor(target: string, parent: DrawingEditor) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Line',
            svg: `<svg width="13px" height="15px" viewBox="2 0 13 17">
                    <line x1="0" y1="13" x2="13" y2="0" stroke="white" stroke-width="2px" />
                  </svg>`
        });
        super(DrawingMode.Line, target, parent, options);
    }
}