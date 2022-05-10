var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var eg = EndGate;
var Wanted;

(function (Wanted) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(gameCanvas, gameScreen, serverAdapter, initializationData) {
            var _this = this;
            _super.call(this, gameCanvas);

            Game.GameConfiguration = new Wanted.ConfigurationManager(initializationData.Configuration);

            // this.Configuration.CollisionConfiguration.MinQuadTreeNodeSize = new eg.Size2d(75);
            // this.Configuration.CollisionConfiguration.InitialQuadTreeSize = new eg.Size2d(10125);

            // this._bufferedViewport = new eg.Bounds.BoundingRectangle(this.Scene.Camera.Position, this.Scene.Camera.Size.Add(Wanted.GameScreen.SCREEN_BUFFER_AREA));
            this._cursorManager = new Wanted.CursorManager(this._bufferedViewport, this.Scene, this.CollisionManager, this.Content);
            this._cursorManager.Initialize(new Wanted.UserCursorManager(initializationData.CursorId, this._cursorManager, this.Input, serverAdapter));
            // this._map = new Wanted.Map(this.Scene, this.CollisionManager, this.Content, this.Input.Keyboard, serverAdapter);
            this._hud = new Wanted.HUDManager(initializationData, this._cursorManager, this.Input.Keyboard, serverAdapter);
            // this._debugManager = new Wanted.Debug.DebugManager(initializationData.CursorId, this, serverAdapter);

            serverAdapter.OnPayload.Bind(function (payload) {
                _this._cursorManager.LoadPayload(payload);
                _this._hud.LoadPayload(payload);
                // _this._debugManager.LoadPayload(payload);
            });

            // gameScreen.OnResize.Bind(function (newSize) {
            //     _this._hud.OnScreenResize(newSize);
            //     _this._bufferedViewport.Size = newSize.Add(Wanted.GameScreen.SCREEN_BUFFER_AREA);
            // });
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Game.prototype.LoadContent = function () {
            // this.Content.LoadImage("StarBackground", "/Images/bg_stars.png", 1000, 1000);

            // Wanted.CursorBodyGraphic.LoadCursorBodies(this.Content);
        };

        Game.prototype.Update = function (gameTime) {
            // this._bufferedViewport.Position = this.Scene.Camera.Position;

            this._cursorManager.Update(gameTime);
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
    })(eg.Game);
    Wanted.Game = Game;
})(Wanted || (Wanted = {}));