(function (Wanted) {
    (function (Server) {
        var PayloadDecompressor = (function () {
            function PayloadDecompressor(contracts) {
                this.PayloadContract = contracts.payloadContract;
                this.CursorContract = contracts.cursorContract;
                this.LeaderboardEntryContract = contracts.leaderboardEntryContract;
            }

            PayloadDecompressor.prototype.DecompressCursor = function (cursor) {
                // console.log(cursor[this.CursorContract.positionX], cursor[this.CursorContract.positionY]);
                return {
                    Position: new eg.Vector2d(cursor[this.CursorContract.positionX], cursor[this.CursorContract.positionY]),
                    Name: cursor[this.CursorContract.name],
                    Wins: cursor[this.CursorContract.wins],
                    Id: cursor[this.CursorContract.id],
                    Disposed: !!cursor[this.CursorContract.disposed]
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

            PayloadDecompressor.prototype.DecompressLeaderboard = function (data) {
                var payload = [];

                for (var i = 0; i < data.length; i++) {
                    var item = this.DecompressLeaderboardEntry(data[i]);
                    item.position = i + 1;

                    payload.push(item);
                }

                return payload;
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