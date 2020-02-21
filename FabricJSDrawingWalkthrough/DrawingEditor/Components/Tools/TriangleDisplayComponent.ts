class TriangleDisplayComponent extends DisplayComponent {
    constructor(target: string, parent: DrawingEditor) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Triangle',
            svg: `<svg width="13px" height="15px" viewBox="0 0 20 20">
                    <line x1="0" y1="20" x2="10" y2="0" stroke="white" stroke-width="2px" />
                    <line x1="10" y1="0" x2="20" y2="20" stroke="white" stroke-width="2px" />
                    <line x1="0" y1="20" x2="20" y2="20" stroke="white" stroke-width="2px" />
                  </svg>`,
        });
        super(DrawingMode.Triangle, target, parent, options);
    }
}