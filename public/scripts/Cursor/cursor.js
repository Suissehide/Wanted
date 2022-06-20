var Wanted;
(function (Wanted) {
    var Cursor = (function (_super) {
        __extends(Cursor, _super);
        function Cursor(payload, contentManager) {
            var _this = this;
            this.Position = new eg.Vector2d(payload.Position.X, payload.Position.Y);
            // this.LevelManager = new Wanted.CursorLevelManager(payload);

            this.Graphic = new Wanted.CursorGraphic(payload.Name, payload.UserControlled, payload.Position, Cursor.SIZE, contentManager);

            // Going to use the rectangle to "hold" all the other graphics
            _super.call(this, this.Graphic.GetDrawBounds());

            // this.MovementController = new Wanted.CursorMovementController(new Array(this.Bounds, this.Graphic));
            // this.MovementController.UserControlled = payload.UserControlled;

            // this.AbilityHandler = new Wanted.CursorAbilityHandler(this);
            // this.AnimationHandler = new Wanted.CursorAnimationHandler(this, contentManager);

            this.LoadPayload(payload, true);

            // this.Graphic.RotateCursor(this.MovementController.Rotation);
        }
        Cursor.prototype.Update = function (gameTime) {
            var _this = this;
            // this.AbilityHandler.Update(gameTime);
            // this.MovementController.Update(gameTime);
            // this.AnimationHandler.Update(gameTime);
            
            var moveables = new Array(this.Bounds, this.Graphic);
            for (var i = 0; i < moveables.length; i++) {
                moveables[i].Position = _this.Position;
            }

            // Updates rotation
            // this.Graphic.RotateCursor(this.MovementController.Rotation);
            this.Graphic.Update(gameTime);
        };

        Cursor.prototype.LoadPayload = function (payload) {
            this.Id = payload.Id;
            this.Position.X = payload.Position.X;
            this.Position.Y = payload.Position.Y;
            // this.MovementController.LoadPayload(payload.MovementController, forceMovement);
        };

        Cursor.SIZE = new eg.Size2d(12);
        return Cursor;
    })(eg.Collision.Collidable);
    Wanted.Cursor = Cursor;
})(Wanted || (Wanted = {}));