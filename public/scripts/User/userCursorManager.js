var eg = EndGate;
var Wanted;
(function (Wanted) {
    var UserCursorManager = (function () {
        function UserCursorManager(ControlledCursorId, _cursorManager, input, serverAdapter) {
            var _this = this;
            this.ControlledCursorId = ControlledCursorId;
            this._cursorManager = _cursorManager;
            this._connection = serverAdapter.Connection;
            this._proxy = serverAdapter.Proxy;
            this._lastSync = new Date();
            this.LatencyResolver = new Wanted.LatencyResolver(serverAdapter);

            // this._collisionManager.OnCollision.Bind(function (cursor, boundary) {
            //     if (cursor instanceof Wanted.Cursor && boundary instanceof Wanted.MapBoundary) {
            //         if (cursor.ID === _this.ControlledCursorId) {
            //             for (var i = Wanted.CursorMovementController.MOVING_DIRECTIONS.length - 1; i >= 0; i--) {
            //                 _this.Invoke("registerMoveStop", false, _this.NewMovementCommand("Forward", false));
            //                 _this.Invoke("registerMoveStop", false, _this.NewMovementCommand("Backward", false));
            //             }
            //         }
            //     }
            // });

            this._cursorInputController = new Wanted.CursorInputController(input.Keyboard, input.Mouse, function (position, isMoving) {
                var cursor = _this._cursorManager.GetCursor(_this.ControlledCursorId);

                if (cursor) {
                    _this.Invoke("registerMove", position, isMoving, _this.LatencyResolver.TryRequestPing());
                }
            }, function (clickMethod) {
                var hubMethod = clickMethod.substr(0, 1).toUpperCase() + clickMethod.substring(1);

                _this._connection.invoke(hubMethod);
            });
        }
        UserCursorManager.prototype.LoadPayload = function (payload) {
            var cursor = this._cursorManager.GetCursor(this.ControlledCursorId);

            // if (cursor) {
            //     cursor.LevelManager.UpdateExperience(payload.Experience, payload.ExperienceToNextLevel);
            // }
        };

        UserCursorManager.prototype.Update = function (gameTime) {
            var cursor = this._cursorManager.GetCursor(this.ControlledCursorId);

            // if (cursor) {
            //     if (eg.TimeSpan.DateSpan(this._lastSync, gameTime.Now).Seconds > UserCursorManager.SYNC_INTERVAL.Seconds && cursor.LifeController.Alive) {
            //         this._lastSync = gameTime.Now;
            //         this._connection.invoke("syncMovement", { X: Math.round(cursor.MovementController.Position.X - cursor.Graphic.Size.HalfWidth), Y: Math.round(cursor.MovementController.Position.Y - cursor.Graphic.Size.HalfHeight) }, Math.roundTo(cursor.MovementController.Rotation * 57.2957795, 2), { X: Math.round(cursor.MovementController.Velocity.X), Y: Math.round(cursor.MovementController.Velocity.Y) });
            //     }

            //     this._userCameraController.Update(gameTime);
            // }
        };

        UserCursorManager.prototype.Invoke = function (method, position, isMoving, pingBack) {
            var cursor = this._cursorManager.GetCursor(this.ControlledCursorId);

            this._connection.invoke(method, isMoving, { X: Math.round(position.X - cursor.Graphic.Size.HalfWidth), Y: Math.round(position.Y - cursor.Graphic.Size.HalfHeight) }, pingBack);
        };

        UserCursorManager.SYNC_INTERVAL = eg.TimeSpan.FromSeconds(1.5);
        return UserCursorManager;
    })();
    Wanted.UserCursorManager = UserCursorManager;
})(Wanted || (Wanted = {}));