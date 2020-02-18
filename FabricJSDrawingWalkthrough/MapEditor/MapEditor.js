var MapDrawer = /** @class */ (function () {
    function MapDrawer() {
    }
    Object.defineProperty(MapDrawer.prototype, "drawingMode", {
        //Properties
        get: function () { return this._drawer.drawingMode; },
        set: function (value) { this._drawer = this.drawers[value]; },
        enumerable: true,
        configurable: true
    });
    return MapDrawer;
}());
//# sourceMappingURL=MapDrawer.js.map