class UndoComponent extends ControlComponent {

    constructor(target: string, parent: DrawingEditor) {
        super(
            target, //Selector
            "fa fa-undo", //Icon CSS Classes
            "Undo", //Tooltip
            parent,
            {
                'click': () => { parent.undo(); }
            });
    }

    render() {
        const html = `<button id="${this.target.replace('#', '')}" title="${this.hoverText}" class="btn btn-info">
                        <i class="${this.cssClass}"></i>
                     </button>`;

        $(this.target).replaceWith(html);
    }
}