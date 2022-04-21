(function (Wanted) {
    (function (Server) {
        var PayloadDecompressor = (function () {
            function PayloadDecompressor(contracts) {
                this.PayloadContract = contracts.payloadContract;
                this.CursorContract = contracts.cursorContract;
                this.LeaderboardEntryContract = contracts.leaderboardEntryContract;
            }

            PayloadDecompressor.prototype.DecompressCursor = function (cursor) {
                return {
                    PositionX: cursor[this.CursorContract.PositionX],
                    PositionY: cursor[this.CursorContract.PositionY],
                    Name: cursor[this.CursorContract.Name],
                    Wins: cursor[this.CursorContract.Wins],
                    Id: cursor[this.CursorContract.Id],
                    Disposed: !!cursor[this.CursorContract.Disposed]
                }
            };

            PayloadDecompressor.prototype.DecompressLeaderboardEntry = function (data) {
                return {
                    Name: data[this.LeaderboardEntryContract.name],
                    Id: data[this.LeaderboardEntryContract.id],
                    Wins: data[this.LeaderboardEntryContract.wins],
                    Position: 0
                };
            };

            PayloadDecompressor.prototype.DecompressPayload = function (data) {
                return {
                    Cursors: data[this.PayloadContract.cursors],
                    LeaderboardPosition: data[this.PayloadContract.leaderboardPosition],
                    CursorsInWorld: data[this.PayloadContract.cursorsInWorld],
                    Notification: data[this.PayloadContract.notification],
                    LastCommandProcessed: data[this.PayloadContract.lastCommandProcessed]
                };
            };

            PayloadDecompressor.prototype.DecompressLeaderboard = function (data) {
                var payload = [];

                for (var i = 0; i < data.length; i++) {
                    var item = this.DecompressLeaderboardEntry(data[i]);
                    item.position = i + 1;

                    payload.push(item);
                }

                return payload;
            };

            PayloadDecompressor.prototype.Decompress = function (data) {
                var payload = this.DecompressPayload(data), i = 0;

                for (i = 0; i < payload.Cursors.length; i++) {
                    payload.Cursors[i] = this.DecompressCursor(payload.Cursors[i]);
                }
                return payload;
            };
            return PayloadDecompressor;
        })();
        Server.PayloadDecompressor = PayloadDecompressor;
    })(Wanted.Server || (Wanted.Server = {}));
    var Server = Wanted.Server;
})(Wanted || (Wanted = {}));
/*next file*/

var Wanted;

(function (Wanted) {
    (function (Server) {
        var ServerConnectionManager = (function () {
            function ServerConnectionManager(_authCookieName) {
                this._authCookieName = _authCookieName;
            }
            ServerConnectionManager.prototype.PrepareRegistration = function () {
                var stateCookie = $.cookie(this._authCookieName), state = stateCookie ? JSON.parse((stateCookie)) : {}, registrationId = state.RegistrationId;

                if (registrationId) {
                    delete state.RegistrationId;

                    // Re-update the registration cookie
                    $.cookie(this._authCookieName, JSON.stringify(state), { path: '/', expires: 30 });

                    return {
                        Name: state.DisplayName,
                        RegistrationId: registrationId
                    };
                } else {
                    throw new Error("Registration Id not available.");
                }
            };
            return ServerConnectionManager;
        })();
        Server.ServerConnectionManager = ServerConnectionManager;
    })(Wanted.Server || (Wanted.Server = {}));
    var Server = Wanted.Server;
})(Wanted || (Wanted = {}));
/*next file*/

var Wanted;

(function (Wanted) {
    (function (Server) {
        var ServerAdapter = (function () {
            function ServerAdapter(Connection, authCookieName) {
                var _this = this;
                this.Connection = Connection;
                this._connectionManager = new Server.ServerConnectionManager(authCookieName);
            }
            ServerAdapter.prototype.Negotiate = function () {
                var _this = this;
                var result = $.Deferred();
                this.Wire();

                this.Connection.start().then(function () {
                    var userInformation = _this._connectionManager.PrepareRegistration();
                    _this.TryInitialize(userInformation, function (initialization) {
                        initialization.UserInformation = userInformation;
                        _this._payloadDecompressor = new Server.PayloadDecompressor(initialization.compressionContracts );

                        result.resolve(initialization);

                        _this.Connection.invoke("readyForPayloads");
                    });
                });

                return result.promise();
            };

            ServerAdapter.prototype.Stop = function () {
                this.Connection.stop();
            };

            ServerAdapter.prototype.TryInitialize = function (userInformation, onComplete, count) {
                if (typeof count === "undefined") { count = 0; }
                var _this = this;
                this.Connection.invoke("initializeClient", userInformation.RegistrationId).then(function (initialization) {
                    if (!initialization) {
                        if (count >= ServerAdapter.NEGOTIATE_RETRIES) {
                            console.log("Could not negotiate with server, refreshing the page.");
                            window.location.reload();
                        } else {
                            setTimeout(function () {
                                _this.TryInitialize(userInformation, onComplete, count + 1);
                            }, ServerAdapter.RETRY_DELAY);
                        }
                    } else {
                        onComplete(initialization);
                    }
                });
            };

            ServerAdapter.prototype.Wire = function () {
                var _this = this;
                this.Connection.on("d", function (payload) {
                    _this._payloadDecompressor.Decompress(payload);
                });

                this.Connection.on("l", function (leaderboardUpdate) {
                    _this._payloadDecompressor.DecompressLeaderboard(leaderboardUpdate);
                });

                this.Connection.on("disconnect", function () {
                //     _this.OnForcedDisconnct.Trigger();
                });

                this.Connection.on("controlTransferred", function () {
                //     _this.OnControlTransferred.Trigger();
                });

                this.Connection.on("pingBack", function () {
                //     _this.OnPingRequest.Trigger();
                });

                this.Connection.on("mapSizeIncreased", function (size) {
                //     _this.OnMapResize.Trigger(new eg.Size2d(size.Width, size.Height));
                });

                this.Connection.on("chatMessage", function (from, message, type) {
                    // _this.OnMessageReceived.Trigger(new Wanted.ChatMessage(from, message, type));
                });
            };

            ServerAdapter.NEGOTIATE_RETRIES = 3;
            ServerAdapter.RETRY_DELAY = 1; //eg.TimeSpan.FromSeconds(1);
            return ServerAdapter;
        })();
        Server.ServerAdapter = ServerAdapter;
    })(Wanted.Server || (Wanted.Server = {}));
    var Server = Wanted.Server;
})(Wanted || (Wanted = {}));
/*next file*/

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
/*next file*/

var Wanted;

$(function () {
    const connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withUrl("http://localhost:5008/hub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        }).build();

    var gameCanvas = $("#game"),
        popUpHolder = $("#popUpHolder"),
        gameContent = $("#gameContent"),
        loadContent = $("#loadContent"),
        serverAdapter = new Wanted.Server.ServerAdapter(connection, "wanted.state")
        // gameScreen = new Wanted.GameScreen(gameCanvas, popUpHolder, serverAdapter)
        ;

    serverAdapter.Negotiate().done(function (initializationData) {
        loadContent.hide();
        gameContent.show();

        game = new Wanted.Game(gameCanvas[0]/*, gameScreen*/, serverAdapter, initializationData);
        // gameScreen.ForceResizeCheck();
    });
});