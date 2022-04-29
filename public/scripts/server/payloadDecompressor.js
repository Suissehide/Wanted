(function (Wanted) {
    (function (Server) {
        var PayloadDecompressor = (function () {
            function PayloadDecompressor(contracts) {
                this.PayloadContract = contracts.PayloadContract;
                this.CursorContract = contracts.CursorContract;
                this.LeaderboardEntryContract = contracts.LeaderboardEntryContract;
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