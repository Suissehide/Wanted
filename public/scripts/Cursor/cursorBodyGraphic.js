var Wanted;
(function (Wanted) {
    var CursorBodyGraphic = (function (_super) {
        __extends(CursorBodyGraphic, _super);
        function CursorBodyGraphic(size) {
            _super.call(this, size.Width / 2, size.Height / 2, CursorBodyGraphic._bodyGraphics, size.Width, size.Height);
        }

        CursorBodyGraphic.LoadCursorBodies = // Made as a static so we don't have to construct the cursor bodies every time a new cursor is created.
            function (contentManager) {
                CursorBodyGraphic._bodyGraphics = contentManager.GetImage("Cursor");
            };
        return CursorBodyGraphic;
    })(eg.Graphics.Sprite2d);
    Wanted.CursorBodyGraphic = CursorBodyGraphic;
})(Wanted || (Wanted = {}));