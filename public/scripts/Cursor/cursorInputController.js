var eg = EndGate;

var Wanted;
(function (Wanted) {
    var CursorInputController = (function () {
        function CursorInputController(_keyboard, _mouse, _onMove, _onClick) {
            var _this = this;
            this._keyboard = _keyboard;
            this._mouse = _mouse;
            this._onMove = _onMove;
            this._onClick = _onClick;

            // this.BindKeys(["space"], "OnCommandDown", "Action1", true);
            // this.BindKeys(["space"], "OnCommandUp", "Action1", false);

            // this._keyboard.OnCommandUp("space", function () {
            //     var now = new Date();

            //     if (eg.TimeSpan.DateSpan(_this._lastBoostTap, now).Milliseconds <= CursorInputController.DOUBLE_TAP_AFTER.Milliseconds) {
            //         _this._onMove("Boost", true);
            //     } else {
            //         _this._lastBoostTap = now;
            //     }
            // });

            this._mouse.OnMove.Bind(function(e) {
                var oldPosition = new eg.Vector2d(0, 0);
                _this._onMove(e.Position, oldPosition.X != e.Position.X || oldPosition.Y != e.Position.Y);
                oldPosition = e.Position;
            });

            this._clickController = new Wanted.CursorClickController(this._mouse, this._onClick);
        }

        // CursorInputController.prototype.BindKeys = function (keyList, bindingAction, direction, startMoving) {
        //     var _this = this;
        //     for (var i = 0; i < keyList.length; i++) {
        //         this._keyboard[bindingAction](keyList[i], function () {
        //             if (_this._directions[direction] !== startMoving) {
        //                 _this._directions[direction] = startMoving;
        //                 _this._onMove(direction, startMoving);
        //             }
        //         });
        //     }
        // };

        CursorInputController.DOUBLE_TAP_AFTER = eg.TimeSpan.FromMilliseconds(350);
        return CursorInputController;
    })();
    Wanted.CursorInputController = CursorInputController;
})(Wanted || (Wanted = {}));