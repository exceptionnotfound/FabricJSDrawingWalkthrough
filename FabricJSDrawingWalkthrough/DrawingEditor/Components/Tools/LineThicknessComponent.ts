class LineThicknessComponent {

    constructor(private readonly target: string, private readonly parent: DrawingEditor) {
        this.render();
    }

    render(): void {
        var opt = new ImageDropdownOptions();
        Object.assign(opt, {
            selectedStyle: ImageDropdownStyle.Copy,
            selectedIndex: 0,
            width: 50,
            optionsList:
                [
                    { display: '<svg width="50px" height="10px"><line x1="0" y1="1" x2="50" y2="1" stroke="black" stroke-width="1px" /></svg>', value: 1, text: '1px' },
                    { display: '<svg width="50px" height="10px"><line x1="0" y1="1" x2="50" y2="1" stroke="black" stroke-width="3px" /></svg>', value: 3, text: '3px' },
                    { display: '<svg width="50px" height="10px"><line x1="0" y1="1" x2="50" y2="1" stroke="black" stroke-width="5px" /></svg>', value: 5, text: '5px' },
                    { display: '<svg width="50px" height="10px"><line x1="0" y1="1" x2="50" y2="1" stroke="black" stroke-width="10px" /></svg>', value: 10, text: '10px' }
                ],
            handlers: {
                'change': (newWidth: number) => {
                    this.parent.setStrokeWidth(<number>newWidth);
                }
            }
        });
        new ImageDropdown(this.target, opt);
    }
}
