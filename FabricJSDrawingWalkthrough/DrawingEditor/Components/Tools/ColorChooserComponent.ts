class ColorChooserComponent {
    private colors = [
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
    ]

    constructor(private readonly target: string, private readonly parent: DrawingEditor, private readonly defaultColor: string, private readonly handlers: { [key: string]: (value?: any) => void }) {
        this.render();
    }

    render(): void {
        var opt = new ImageDropdownOptions();
        const def = this.colors.filter((c) => {
            if (c.code === this.defaultColor)
                return c;
        });

        Object.assign(opt, {
            selectedStyle: ImageDropdownStyle.Fill,
            selectedIndex: def[0].key,
            width: 50,
            childWidth: 153,
            optionsList: this.getOptions(),
            handlers: this.handlers
        });

        new ImageDropdown(this.target, opt);
    }

    private getOptions(): ImageOption[] {
        const values: ImageOption[] = [];
        this.colors.forEach((color) => {
            const fillColor = color.code === '' ? 'none' : color.code;
            values.push(
                {
                    display: `<svg width="16px" height="15px" viewBox="0 0 15 15"><rect width="15" height="15" top="0" fill="${fillColor}" stroke="black" stroke-width="1px" /></svg>`,
                    value: color.code,
                    text: color.text
                }
            );
        });

        return values;
    }
}