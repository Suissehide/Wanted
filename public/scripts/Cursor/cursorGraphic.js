var Wanted;
(function (Wanted) {
    var CursorGraphic = (function (_super) {
        __extends(CursorGraphic, _super);
        function CursorGraphic(name, userControlled, position, size, contentManager) {
            // The Graphic color is transparent because all graphics that represent a cursor will be added as a child.
            _super.call(this, position.X, position.Y, size.Width, size.Height, eg.Graphics.Color.Transparent);

            // this._statusGraphic = new Wanted.CursorStatusTextGraphic(levelManager, lifeController);
            // this._damageGraphic = new Wanted.CursorDamageGraphic(lifeController, contentManager);

            this.Body = new Wanted.CursorBodyGraphic(size);
            this.Body.Rotation = 0;

            this.AddChild(this.Body);
            // this.AddChild(this._statusGraphic);
            // this.Body.AddChild(this._damageGraphic);

            if (!userControlled) {
                // this._lifeBar = new Wanted.CursorLifeGraphic(lifeController);
                this._nameGraphic = new Wanted.CursorNameGraphic(name);

                // this.AddChild(this._lifeBar);
                this.AddChild(this._nameGraphic);
            } else {
                // this.HideCursor();
            }
        }
        CursorGraphic.prototype.Status = function (text, size, color, fadeDuration, reverseDirection) {
            // this._statusGraphic.Status(text, size, color, fadeDuration, reverseDirection);
        };

        CursorGraphic.prototype.AddChildToCursor = function (child) {
            this.Body.AddChild(child);
        };

        CursorGraphic.prototype.HideCursor = function () {
            if (this._nameGraphic) {
                this._nameGraphic.Visible = false;
            }

            this.Body.Visible = false;
        };

        CursorGraphic.prototype.Update = function (gameTime) {
            // this._statusGraphic.Update(gameTime);
        };
        return CursorGraphic;
    })(eg.Graphics.Rectangle);
    Wanted.CursorGraphic = CursorGraphic;
})(Wanted || (Wanted = {}));