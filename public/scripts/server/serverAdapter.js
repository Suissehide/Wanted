var Wanted;

(function (Wanted) {
    (function (Server) {
        var ServerAdapter = (function () {
            function ServerAdapter(connection, authCookieName) {
                var _this = this;
                this.Connection = connection;
                this.Proxy = Proxy;
                var savedProxyInvoke = this.Proxy.invoke;

                this.OnPayload = new eg.EventHandler1();
                this.OnLeaderboardUpdate = new eg.EventHandler1();
                this.OnForcedDisconnect = new eg.EventHandler();
                this.OnControlTransferred = new eg.EventHandler();
                this.OnPingRequest = new eg.EventHandler();
                this.OnMapResize = new eg.EventHandler1();
                this.OnMessageReceived = new eg.EventHandler1();
                
                this._connectionManager = new Server.ServerConnectionManager(authCookieName);

                (this.Proxy.invoke) = function () {
                    if ((_this.Connection).state === $.signalR.connectionState.connected) {
                        return savedProxyInvoke.apply(_this.Proxy, arguments);
                    }
                };
            }

            ServerAdapter.prototype.Negotiate = function () {
                var _this = this;
                
                var result = $.Deferred();

                this.Wire();

                this.Connection.start().then(function () {
                    var userInformation = _this._connectionManager.PrepareRegistration();
                    console.log("userInformation: ", userInformation);
                    _this.TryInitialize(userInformation, function (initialization) {
                        initialization.userInformation = userInformation;
                        console.log(initialization);
                        _this._payloadDecompressor = new Server.PayloadDecompressor(initialization.compressionContracts);

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
                this.Connection.invoke("InitializeClient", userInformation.RegistrationId).then(function (initialization) {
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
                    // console.log("Payload: ", payload);
                    try {
                        _this.OnPayload.Trigger(_this._payloadDecompressor.Decompress(payload));
                    } catch (e) {
                        console.log("error:", e);
                    }
                });

                this.Connection.on("l", function (leaderboardUpdate) {
                    _this.OnLeaderboardUpdate.Trigger(_this._payloadDecompressor.DecompressLeaderboard(leaderboardUpdate));
                });

                this.Connection.on("disconnect", function () {
                    _this.OnForcedDisconnect.Trigger();
                });

                this.Connection.on("controlTransferred", function () {
                    //     _this.OnControlTransferred.Trigger();
                });

                this.Connection.on("pingBack", function () {
                    _this.OnPingRequest.Trigger();
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