var Wanted;
(function (Wanted) {
    var CursorNameGraphic = (function (_super) {
        __extends(CursorNameGraphic, _super);
        function CursorNameGraphic(name) {
            _super.call(this, CursorNameGraphic.X_OFFSET, Wanted.Cursor.SIZE.HalfHeight + CursorNameGraphic.Y_OFFSET, name, CursorNameGraphic.NAME_COLOR);

            this.FontSettings.FontSize = CursorNameGraphic.FONT_SIZE;
            this.FontSettings.FontFamily = eg.Graphics.Assets.FontFamily.Arial;
            this.FontSettings.FontWeight = "normal";
        }

        CursorNameGraphic.FONT_SIZE = "10px";
        CursorNameGraphic.X_OFFSET = 30;
        CursorNameGraphic.Y_OFFSET = 8;
        CursorNameGraphic.NAME_COLOR = eg.Graphics.Color.Black;

        return CursorNameGraphic;
    })(eg.Graphics.Text2d);
    Wanted.CursorNameGraphic = CursorNameGraphic;
})(Wanted || (Wanted = {}));