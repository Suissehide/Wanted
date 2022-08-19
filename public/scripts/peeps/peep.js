var Wanted;
(function (Wanted) {
    var Peep = (function (_super) {
        __extends(Peep, _super);
        function Peep(payload, gameScreen) {
            var _this = this;
            this._gameScreen = gameScreen;
            this.Position = new eg.Vector2d();
            this.Graphic = new Wanted.PeepGraphic(payload, this.Position, Peep.SCALE);

            // Going to use the rectangle to "hold" all the other graphics
            _super.call(this, this.Graphic.GetDrawBounds());
        }

        Peep.prototype.ResetPeep = function () {
            const direction = Math.random() > 0.5 ? 1 : -1;
            const peepHeight = this.Graphic.Size.Height;
            const peepWidth = this.Graphic.Size.Width;
            // using an ease function to skew random to lower values to help hide that peeps have no legs
            const startY = Wanted.RandomRange(0, this._gameScreen.Viewport.Height - (peepHeight * Peep.SCALE / 2));
            this.ScaleY = 1;
            let startX = Wanted.RandomRange(- peepWidth, this._gameScreen.Viewport.Height + peepWidth);
            let endX;

            if (direction === 1) {
                endX = this._gameScreen.Viewport.Width;
                this.ScaleX = 1;
            } else {
                endX = 0;
                this.ScaleX = -1;
            }
            
            this.Graphic.Flip(this.ScaleX == -1);
            this.Position.X = startX;
            this.Position.Y = startY;
            this.EndX = endX;
            this.AnchorY = startY;
            this.Visible = false;
            this.xVelocity = Wanted.RandomRange(50, 350);
            this.yVelocity = this.xVelocity * 0.4;
        };

        Peep.prototype.Move = function (gameTime) {
            const yDuration = 8;
            const peepWidth = this.Graphic.Size.Width;

            if (this.Position.X < 0 - peepWidth) {
                this.ScaleX = 1;
                this.Graphic.Flip(this.ScaleX == -1);
            }
            else if (this.Position.X > this._gameScreen.Viewport.Width + peepWidth) {
                this.ScaleX = -1;
                this.Graphic.Flip(this.ScaleX == -1);
            }
            this.Position.X += this.xVelocity * gameTime.Elapsed.Seconds * this.ScaleX;

            if (this.Position.Y > this.AnchorY + yDuration) {
                this.ScaleY = -1;
            }
            else if (this.Position.Y < this.AnchorY - yDuration) {
                this.ScaleY = 1;
            }
            this.Position.Y += this.yVelocity * gameTime.Elapsed.Seconds * this.ScaleY;
        };

        Peep.prototype.Update = function (gameTime) {
            var _this = this;

            _this.Move(gameTime);

            var moveables = new Array(this.Bounds, this.Graphic);
            for (var i = 0; i < moveables.length; i++) {
                moveables[i].Position = _this.Position;
            }

            // Updates rotation
            // this.Graphic.RotatePeep(this.MovementController.Rotation);
            // this.Graphic.Update(gameTime);
        };

        Peep.SCALE = 0.8;
        return Peep;
    })(eg.Collision.Collidable);
    Wanted.Peep = Peep;
})(Wanted || (Wanted = {}));