var Wanted;
(function (Wanted) {
    var GameScreen = (function () {
        function GameScreen(_gameCanvas, _popUpHolder, _serverAdapter) {
            var _this = this;
            this._gameCanvas = _gameCanvas;
            this._popUpHolder = _popUpHolder;
            this._serverAdapter = _serverAdapter;
            this._gameHUDHeight = $("#gameHUD").height();
            this.Viewport = this.UpdateViewport();
            this.OnResize = new EndGate.EventHandler1();
            this.OnResizeComplete = new EndGate.EventHandler();

            $(window).resize(function () {
                // Wait till window has officially finished resizing (wait a quarter second).
                Wanted.delay(function () {
                    _this.ScreenResizeEvent();
                }, 250);
            });

            this.ForceResizeCheck();
        }
        GameScreen.prototype.ForceResizeCheck = function () {
            this.ScreenResizeEvent();
        };

        GameScreen.prototype.UpdateGameCanvas = function () {
            this._gameCanvas.attr("width", this.Viewport.Width);
            this._gameCanvas.attr("height", this.Viewport.Height);

            if (this._popUpHolder) {
                this._popUpHolder.css("width", this.Viewport.Width);
                this._popUpHolder.css("height", this.Viewport.Height);
            }
        };

        GameScreen.prototype.UpdateScreen = function () {
            this.Viewport = this.UpdateViewport();

            this.UpdateGameCanvas();

            this.SendNewViewportToServer();
            this.OnResize.Trigger(this.Viewport);
        };

        GameScreen.prototype.ScreenResizeEvent = function () {
            var _this = this;
            this.UpdateScreen();
            setTimeout(function () {
                _this.UpdateScreen();
                _this.OnResizeComplete.Trigger();
            }, 1500);
        };

        GameScreen.prototype.UpdateViewport = function () {
            return new eg.Size2d(Math.max(Math.min($(window).width(), GameScreen.MAX_SCREEN_WIDTH), GameScreen.MIN_SCREEN_WIDTH), Math.max(Math.min($(window).height() - this._gameHUDHeight - 3, GameScreen.MAX_SCREEN_HEIGHT), GameScreen.MIN_SCREEN_HEIGHT));
        };

        GameScreen.prototype.SendNewViewportToServer = function () {
            // this._serverAdapter.Connection.invoke("changeViewport", this.Viewport.Width, this.Viewport.Height);
        };
        GameScreen.MAX_SCREEN_WIDTH = 1920;
        GameScreen.MAX_SCREEN_HEIGHT = 1080;
        GameScreen.MIN_SCREEN_WIDTH = 800;
        GameScreen.MIN_SCREEN_HEIGHT = 480;
        GameScreen.SCREEN_BUFFER_AREA = 200;
        return GameScreen;
    })();
    Wanted.GameScreen = GameScreen;
})(Wanted || (Wanted = {}));