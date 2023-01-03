var Wanted;
$(function () {
    var connection = new signalR
        .HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withUrl("https://localhost:44302/hub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .build();

    var gameCanvas = $("#game"),
        popUpHolder = $("#popUpHolder"),
        gameContent = $("#gameContent"),
        loadContent = $("#loadContent"),
        serverAdapter = new Wanted.Server.ServerAdapter(connection, "wanted.state"),
        gameScreen = new Wanted.GameScreen(gameCanvas, popUpHolder, serverAdapter);

    console.log("SERVER ADAPTER", serverAdapter);

    serverAdapter.Negotiate().done(function (initializationData) {
        loadContent.hide();
        gameContent.show();
    
        game = new Wanted.Game(gameCanvas[0], gameScreen, serverAdapter, initializationData);
        gameScreen.ForceResizeCheck();
    });
});