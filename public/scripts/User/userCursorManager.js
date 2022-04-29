var eg = EndGate;
var Wanted;
(function (Wanted) {
    var UserCursorManager = (function () {
        function UserCursorManager(ControlledCursorId, _cursorManager, /*_collisionManager,*/ input, /*_camera,*/ serverAdapter) {
            var _this = this;
            this.ControlledCursorId = ControlledCursorId;
            this._cursorManager = _cursorManager;
            // this._collisionManager = _collisionManager;
            // this._camera = _camera;
            this._connection = serverAdapter.Connection;
            //this._proxy = serverAdapter.Proxy;
            // this._userCameraController = new Wanted.UserCameraController(this.ControlledCursorId, this._cursorManager, this._camera);
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

            this._cursorInputController = new Wanted.CursorInputController(input.Keyboard, function (direction, startMoving) {
                var cursor = _this._cursorManager.GetCursor(_this.ControlledCursorId);

                if (cursor && cursor.MovementController.Controllable && cursor.LifeController.Alive) {
                    if (startMoving) {
                        if (direction === "Boost") {
                            _this.Invoke("registerAbilityStart", _this.LatencyResolver.TryRequestPing(), _this.NewAbilityCommand(direction, true));

                            cursor.AbilityHandler.Activate(direction);
                            // Don't want to trigger a server command if we're already moving in the direction
                        } else if (!cursor.MovementController.IsMovingInDirection(direction)) {
                            _this.Invoke("registerMoveStart", _this.LatencyResolver.TryRequestPing(), _this.NewMovementCommand(direction, true));

                            cursor.MovementController.Move(direction, startMoving);
                        }
                    } else {
                        if (cursor.MovementController.IsMovingInDirection(direction)) {
                            _this.Invoke("registerMoveStop", _this.LatencyResolver.TryRequestPing(), _this.NewMovementCommand(direction, false));

                            cursor.MovementController.Move(direction, startMoving);
                        }
                    }
                }
            }, function (clickMethod) {
                var hubMethod = clickMethod.substr(0, 1).toUpperCase() + clickMethod.substring(1);

                _this._connection.invoke(hubMethod);
            });
        }
        UserCursorManager.prototype.LoadPayload = function (payload) {
            var cursor = this._cursorManager.GetCursor(this.ControlledCursorId);

            if (cursor) {
                cursor.LevelManager.UpdateExperience(payload.Experience, payload.ExperienceToNextLevel);
            }
        };

        UserCursorManager.prototype.Update = function (gameTime) {
            var cursor = this._cursorManager.GetCursor(this.ControlledCursorId);

            if (cursor) {
                if (eg.TimeSpan.DateSpan(this._lastSync, gameTime.Now).Seconds > UserCursorManager.SYNC_INTERVAL.Seconds && cursor.LifeController.Alive) {
                    this._lastSync = gameTime.Now;
                    this._connection.invoke("syncMovement", { X: Math.round(cursor.MovementController.Position.X - cursor.Graphic.Size.HalfWidth), Y: Math.round(cursor.MovementController.Position.Y - cursor.Graphic.Size.HalfHeight) }, Math.roundTo(cursor.MovementController.Rotation * 57.2957795, 2), { X: Math.round(cursor.MovementController.Velocity.X), Y: Math.round(cursor.MovementController.Velocity.Y) });
                }

                this._userCameraController.Update(gameTime);
            }
        };

        UserCursorManager.prototype.Invoke = function (method, pingBack, command) {
            var cursor = this._cursorManager.GetCursor(this.ControlledCursorId);

            this._connection.invoke(method, command.Command, { X: Math.round(cursor.MovementController.Position.X - cursor.Graphic.Size.HalfWidth), Y: Math.round(cursor.MovementController.Position.Y - cursor.Graphic.Size.HalfHeight) }, Math.roundTo(cursor.MovementController.Rotation * 57.2957795, 2), { X: Math.round(cursor.MovementController.Velocity.X), Y: Math.round(cursor.MovementController.Velocity.Y) }, pingBack);
        };

        UserCursorManager.prototype.NewMovementCommand = function (direction, startMoving) {
            var command = {
                Command: direction,
                Start: startMoving,
                IsAbility: false
            };

            return command;
        };

        UserCursorManager.prototype.NewAbilityCommand = function (ability, startMoving) {
            var command = {
                Command: ability,
                Start: startMoving,
                IsAbility: true
            };

            return command;
        };
        UserCursorManager.SYNC_INTERVAL = eg.TimeSpan.FromSeconds(1.5);
        return UserCursorManager;
    })();
    Wanted.UserCursorManager = UserCursorManager;
})(Wanted || (Wanted = {}));