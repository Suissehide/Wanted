var Wanted;
(function (Wanted) {
    var HUDManager = (function () {
        function HUDManager(initialization, _cursorManager, areaRenderer, keyboard, serverAdapter) {
            this._cursorManager = _cursorManager;
            this._gameHUD = $("#gameHUD");
            this._doublePopupHolder = $("#doublePopupHolder");
            this._locationStats = $("#LocationStatisticsHolder");
            this._cursorStats = $("#StatisticHolder");
            this._logout = $("#logout");
            this._myCursorId = initialization.CursorId;
            // this._gameHUDHeight = this._gameHUD.height();
            // this._cursorStatMonitor = new Wanted.CursorStatMonitor();
            // this._cursorHealthMonitor = new Wanted.HealthMonitor();
            // this._cursorExperienceMonitor = new Wanted.ExperienceMonitor();
            // this._rankingsManager = new Wanted.RankingsManager();
            // this._environmentMonitor = new Wanted.EnvironmentMonitor(areaRenderer, this._cursorManager.UserCursorManager);
            // this._leaderboardManager = new Wanted.LeaderboardManager(this._myCursorId, keyboard, serverAdapter);
            // this._deathScreen = new Wanted.DeathScreen();
            // this._notificationManager = new Wanted.NotificationManager(serverAdapter);
            // this._userInformationManager = new Wanted.UserInformationManager(initialization.UserInformation);
            // this._chat = new Wanted.Chat(initialization.UserInformation, serverAdapter);

            this._logout.click(function () {
                // Clear cookies
                var c = document.cookie.split(";");
                for (var i = 0; i < c.length; i++) {
                    var e = c[i].indexOf("=");
                    var n = e > -1 ? c[i].substr(0, e) : c[i];
                    document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }

                window.location.reload(true);
            });
        }
        HUDManager.prototype.OnScreenResize = function (newViewport) {
            this._gameHUD.css("width", newViewport.Width);
            this._gameHUD.css("height", this._gameHUDHeight);
            this._gameHUD.css("top", newViewport.Height);
            this._cursorHealthMonitor.OnScreenResize();
            this.CenterDoublePopup(newViewport);

            if (newViewport.Width <= 1370) {
                this._locationStats.css("display", "none");
            } else {
                this._locationStats.css("display", "block");
            }

            if (newViewport.Width <= 1177) {
                this._cursorStats.css("display", "none");
            } else {
                this._cursorStats.css("display", "block");
            }
        };

        HUDManager.prototype.CenterDoublePopup = function (newViewport) {
            // The left is handled by the css
            this._doublePopupHolder.css("top", (newViewport.Height / 2) - this._doublePopupHolder.height() / 2);
        };

        HUDManager.prototype.LoadPayload = function (payload) {
            this._rankingsManager.LoadPayload(payload);
            this._environmentMonitor.LoadPayload(payload);
            this._deathScreen.LoadPayload(payload);
            this._notificationManager.LoadPayload(payload);
        };

        HUDManager.prototype.Update = function (gameTime) {
            var cursor = this._cursorManager.GetCursor(this._myCursorId);

            if (cursor) {
                this._cursorStatMonitor.Update(cursor);
                // this._cursorHealthMonitor.Update(cursor);
                // this._cursorExperienceMonitor.Update(cursor);
                this._environmentMonitor.Update(cursor);
                this._rankingsManager.Update(cursor);
            }
        };
        return HUDManager;
    })();
    Wanted.HUDManager = HUDManager;
})(Wanted || (Wanted = {}));