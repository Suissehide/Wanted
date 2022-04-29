var Wanted;
(function (Wanted) {
    var EnvironmentMonitor = (function () {
        function EnvironmentMonitor(_userCursorManager) {
            this._userCursorManager = _userCursorManager;
            this._latency = $("#latency");
            this._cursorsInWorld = $("#cursorsInWorld");
        }
        EnvironmentMonitor.prototype.LoadPayload = function (payload) {
            this._latency[0].innerHTML = this._userCursorManager.LatencyResolver.Latency;
            this._cursorsInWorld[0].innerHTML = payload.CursorsInWorld.toString();
        };

        EnvironmentMonitor.prototype.Update = function (ship) {
            this._area[0].innerHTML = this._areaRenderer.AreaFromPosition(ship.MovementController.Position).toString();
        };
        return EnvironmentMonitor;
    })();
    Wanted.EnvironmentMonitor = EnvironmentMonitor;
})(Wanted || (Wanted = {}));