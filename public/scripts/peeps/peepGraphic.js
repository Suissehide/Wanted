var Wanted;
(function (Wanted) {
    var PeepGraphic = (function (_super) {
        __extends(PeepGraphic, _super);
        function PeepGraphic(payload, position, scale) {
            _super.call(this, position.X, position.Y, payload.rectWidth * scale, payload.rectHeight * scale, eg.Graphics.Color.Transparent);

            this._peepBody = new eg.Graphics.Sprite2d(40, 40, payload.tile, payload.rectWidth * scale, payload.rectHeight * scale);
            this._peepBodyMirror = new eg.Graphics.Sprite2d(40, 40, payload.tileMirror, payload.rectWidth * scale, payload.rectHeight * scale);
            this.AddChild(this._peepBody);
            this.AddChild(this._peepBodyMirror);
            this.Visible = false;
        }

        PeepGraphic.prototype.Flip = function (mirror) {
            this._peepBodyMirror.Visible = mirror;
            this._peepBody.Visible = !mirror;
        };

        return PeepGraphic;
    })(eg.Graphics.Rectangle);
    Wanted.PeepGraphic = PeepGraphic;
})(Wanted || (Wanted = {}));