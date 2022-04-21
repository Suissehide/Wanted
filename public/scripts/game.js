(function (Wanted) {
    var Game = (function () {
        function Game(gameCanvas, /*gameScreen,*/ serverAdapter, initializationData) {
            var _this = this;

            Game.GameConfiguration = new Wanted.ConfigurationManager(initializationData.Configuration);

            // this.Configuration.CollisionConfiguration.MinQuadTreeNodeSize = new eg.Size2d(75);
            // this.Configuration.CollisionConfiguration.InitialQuadTreeSize = new eg.Size2d(10125);

            // this._bufferedViewport = new eg.Bounds.BoundingRectangle(this.Scene.Camera.Position, this.Scene.Camera.Size.Add(Wanted.GameScreen.SCREEN_BUFFER_AREA));
            this._shipManager = new Wanted.ShipManager(this._bufferedViewport, this.Scene, this.CollisionManager, this.Content);
            this._shipManager.Initialize(new Wanted.UserShipManager(initializationData.ShipId, this._shipManager, this.CollisionManager, this.Input, this.Scene.Camera, serverAdapter));
            // this._map = new Wanted.Map(this.Scene, this.CollisionManager, this.Content, this.Input.Keyboard, serverAdapter);
            this._hud = new Wanted.HUDManager(initializationData, this._shipManager, this._map.AreaRenderer, this.Input.Keyboard, serverAdapter);
            // this._debugManager = new Wanted.Debug.DebugManager(initializationData.ShipId, this, serverAdapter);

            serverAdapter.OnPayload.Bind(function (payload) {
                _this._shipManager.LoadPayload(payload);
                _this._hud.LoadPayload(payload);
                // _this._debugManager.LoadPayload(payload);
            });

            // gameScreen.OnResize.Bind(function (newSize) {
            //     _this._hud.OnScreenResize(newSize);
            //     _this._bufferedViewport.Size = newSize.Add(Wanted.GameScreen.SCREEN_BUFFER_AREA);
            // });
        }
        Game.prototype.LoadContent = function () {
            // this.Content.LoadImage("StarBackground", "/Images/bg_stars.png", 1000, 1000);

            // Wanted.ShipBodyGraphic.LoadShipBodies(this.Content);
        };

        Game.prototype.Update = function (gameTime) {
            // this._bufferedViewport.Position = this.Scene.Camera.Position;

            this._shipManager.Update(gameTime);
            this._hud.Update(gameTime);
            // this._debugManager.Update(gameTime);
        };

        // Most drawing takes place via the Scene.
        // This method can be used to draw items to the game screen with raw canvas API's.
        // I don't do this because there's no need :), i only update the debug manager in order to track the draw rate.
        Game.prototype.Draw = function (context) {
            // this._debugManager.Draw(context);
        };
        return Game;
    })(/*eg.Game*/);
    Wanted.Game = Game;
})(Wanted || (Wanted = {}));