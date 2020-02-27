class Copier {
    private memorizedObject: fabric.Object

    constructor(private readonly editor: DrawingEditor) { }

    copy(callBack?: Function) {
        const activeObject = this.editor.canvas.getActiveObject();

        if (activeObject !== null) {
            activeObject.clone((object) => {
                this.memorizedObject = object;
                object.set({
                    left: object.left + 10,
                    top: object.top + 10
                });

                if (callBack !== undefined)
                    callBack();
            });
        }
    }

    cut() {
        this.copy(() => this.editor.deleteSelected());
    }

    paste() {
        if (this.memorizedObject !== undefined) {
            this.memorizedObject.clone((clonedObject) => {
                this.editor.canvas.add(clonedObject);
                this.editor.canvas.setActiveObject(clonedObject);
                this.editor.stateManager.saveState();
                this.editor.canvas.renderAll();
            });
        }
    }
}