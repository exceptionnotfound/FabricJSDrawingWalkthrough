class DeleteComponent extends ControlComponent {
    constructor(target: string, parent: DrawingEditor) {
        super(
            target,
            "fa fa-trash-o", //CSS class for icons
            "Delete Selected Item", //Tooltip text
            parent,
            {
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