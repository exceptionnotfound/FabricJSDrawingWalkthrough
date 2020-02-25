class RedoComponent extends ControlComponent {

    constructor(target: string, parent: DrawingEditor) {
        super(
            target, //Selector
            "fa fa-repeat", //Icon CSS Classes
            "Redo", //Tooltip
            parent,
            {
                'click': () => { parent.redo(); }
            });
    }

    render() {
        const html = `<button id="${this.target.replace('#', '')}" title="${this.hoverText}" class="btn btn-info">
                        <i class="${this.cssClass}"></i>
                     </button>`;

        $(this.target).replaceWith(html);
    }
}