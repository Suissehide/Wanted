var Wanted;
(function (Wanted) {
    var LeaderboardManager = (function () {
        function LeaderboardManager(_myCursorId, _keyboard, _serverAdapter) {
            var _this = this;
            this._myCursorId = _myCursorId;
            this._keyboard = _keyboard;
            this._serverAdapter = _serverAdapter;
            this._leaderboardHolder = $("#leaderboardHolder, #doublePopupHolder");
            this._leaderboard = $("#leaderboard");
            this._popUpHolder = $("#popUpHolder");
            this._gameCover = $("#GameCover");
            this._myRanking = $("#myRanking");
            this._leaderboardRows = [];
            this.LeaderboardUp = false;
            this.initializeLeaderboardRows();
            this.applyKeyboardShortcuts();

            this._serverAdapter.OnLeaderboardUpdate.Bind(function (leaderboardData) {
                _this.bindToLeaderboard(leaderboardData);
            });
        }
        LeaderboardManager.prototype.initializeLeaderboardRows = function () {
            var tempRow = $("#leaderboard .row");

            this._leaderboardRows.push(tempRow);

            for (var i = 0; i < LeaderboardManager.LEADERBOARD_SIZE - 1; i++) {
                var rowCopy = tempRow.clone();
                this._leaderboardRows.push(rowCopy);
                this._leaderboard.append(rowCopy);
            }
        };

        LeaderboardManager.prototype.bindToLeaderboard = function (data) {
            for (var i = 0; i < data.length; i++) {
                var row = $(this._leaderboardRows[i]);

                if (data[i].Id === this._myCursorId) {
                    row.addClass("highlight");
                } else {
                    row.removeClass("highlight");
                }

                // Delete the photo and Id from the data because we don't want them to be bound with the rest of the data
                delete data[i].Id;

                for (var key in data[i]) {
                    row.find(".lb" + key).html(data[i][key]);
                }
            }
        };

        // Create shortcuts
        LeaderboardManager.prototype.applyKeyboardShortcuts = function () {
            var _this = this;
            this._keyboard.OnCommandPress("l", function () {
                _this.toggleLeaderboard();
            });

            $("#GlobalRanking").click(function () {
                _this.toggleLeaderboard();
            });
        };

        LeaderboardManager.prototype.toggleLeaderboard = function () {
            if (!this.LeaderboardUp) {
                this.showLeaderboard();
            } else {
                this.hideLeaderboard();
            }
        };

        LeaderboardManager.prototype.showLeaderboard = function () {
            if (!this._leaderboard.hasClass('goLeft')) {
                this.LeaderboardUp = true;
                this._leaderboardHolder.css("display", "block");
                this._popUpHolder.fadeIn(350);
                this._gameCover.fadeIn(350);
                this._serverAdapter.Connection.invoke("readyForLeaderboardPayloads");
            }
        };

        LeaderboardManager.prototype.hideLeaderboard = function () {
            var _this = this;
            if (!this._leaderboard.hasClass('goLeft')) {
                this.LeaderboardUp = false;
                this._popUpHolder.fadeOut(200, function () {
                    _this._leaderboardHolder.css("display", "none");
                });
                this._gameCover.fadeOut(200);
                this._serverAdapter.Connection.invoke("stopLeaderboardPayloads");
            }
        };
        return LeaderboardManager;
    })();
    Wanted.LeaderboardManager = LeaderboardManager;
})(Wanted || (Wanted = {}));