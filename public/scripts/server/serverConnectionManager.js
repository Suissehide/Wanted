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