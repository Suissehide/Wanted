var Wanted;
(function (Wanted) {
    var CursorManager = (function () {
        function CursorManager(_viewport, _scene, _collisionManager, _contentManager) {
            this._viewport = _viewport;
            this._scene = _scene;
            // this._collisionManager = _collisionManager;
            this._contentManager = _contentManager;
            this._cursors = {};
        }
        CursorManager.prototype.Initialize = function (userCursorManager) {
            this.UserCursorManager = userCursorManager;
        };

        CursorManager.prototype.UpdateViewport = function (viewport) {
            this._viewport.Size = viewport;
        };

        CursorManager.prototype.GetCursor = function (id) {
            return this._cursors[id];
        };

        CursorManager.prototype.RemoveCursor = function (cursorId) {
            delete this._cursors[cursorId];
        };

        CursorManager.prototype.LoadPayload = function (payload) {
            var _this = this;
            var cursorPayload = payload.Cursors, cursor;

            for (var i = 0; i < cursorPayload.length; i++) {
                cursor = cursorPayload[i];

                if (!this._cursors[cursor.Id]) {
                    if (cursor.Id === this.UserCursorManager.ControlledCursorId) {
                        cursor.UserControlled = true;
                    } else {
                        cursor.UserControlled = false;
                    }

                    this._cursors[cursor.Id] = new Wanted.Cursor(cursor, this._contentManager);
                    // this._collisionManager.Monitor(this._cursors[cursor.Id]);
                    this._scene.Add(this._cursors[cursor.Id].Graphic);

                    // this._cursors[cursor.Id].OnDisposed.Bind(function (cursor) {
                    //     delete _this._cursors[(cursor).Id];
                    // });
                } else {
                    this._cursors[cursor.Id].LoadPayload(cursor);
                }

                // if (cursor.Disposed) {
                //     this._cursors[cursor.Id].Destroy(!cursor.LifeController.Alive);
                // }
            }

            this.UserCursorManager.LoadPayload(payload);
        };

        CursorManager.prototype.Update = function (gameTime) {
            for (var id in this._cursors) {
                this._cursors[id].Update(gameTime);
            }

            this.UserCursorManager.Update(gameTime);

            for (var id in this._cursors) {
                if (!this._cursors[id].Bounds.IntersectsRectangle(this._viewport)) {
                    this._cursors[id].Destroy();
                }
            }
        };
        return CursorManager;
    })();
    Wanted.CursorManager = CursorManager;
})(Wanted || (Wanted = {}));