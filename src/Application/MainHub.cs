using Microsoft.AspNetCore.SignalR;
using Wanted.Application;
using Wanted.Application.CursorEntity;

namespace Wanted.Hubs
{
    public class MainHub : Hub
    {
        private readonly Game _game;
        private readonly ILogger _logger;

        public MainHub(Game game, ILogger logger)
        {
            _game = game;
            _logger = logger;
        }

        public override Task OnConnectedAsync()
        {
            _game.ConnectionManager.OnConnected(Context.ConnectionId);
            return Task.CompletedTask;
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return _game.ConnectionManager.OnDisconnectedAsync(Context.ConnectionId);
        }

        public void readyForPayloads()
        {
            try
            {
                _game.UserHandler.GetUser(Context.ConnectionId).ReadyForPayloads = true;
            }
            catch (Exception e)
            {
                _logger.LogError("readyForPayloads", e);
            }
        }

        public object initializeClient(string registrationId)
        {
            if (_game.RegistrationHandler.RegistrationExists(registrationId))
            {
                return _game.initializeClient(Context.ConnectionId, _game.RegistrationHandler.RemoveRegistration(registrationId));
            }

            return null;
        }

        public async Task readyForLeaderboardPayloads()
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    _game.UserHandler.GetUser(Context.ConnectionId).IdleManager.RecordActivity();
                    await _game.Leaderboard.RequestLeaderboardAsync(Context.ConnectionId);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("readyForLeaderboardPayloads", e);
            }
        }

        public async Task stopLeaderboardPayloads()
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    _game.UserHandler.GetUser(Context.ConnectionId).IdleManager.RecordActivity();
                    await _game.Leaderboard.StopRequestingLeaderboardAsync(Context.ConnectionId);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("stopLeaderboardPayloads", e);
            }
        }

        public async Task sendMessage(string message)
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    Cursor cursor = _game.UserHandler.GetUserCursor(Context.ConnectionId);
                    var from = cursor.Name;

                    //TODO: send a message to #wanter using the jabbr c# client later
                    await Clients.AllExcept(new List<string> { Context.ConnectionId }).SendAsync("chatMessage", from, message, 0 /* standard message */);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("sendMessage", e);
            }
        }



        public void Echo(string name, string message)
        {
            Clients.Client(Context.ConnectionId).SendAsync("echo", name, message + " (echo from server)");
        }

        public Task Draw(int prevX, int prevY, int currentX, int currentY, string color)
        {
            return Clients.Others.SendAsync("draw", prevX, prevY, currentX, currentY, color);
        }

        public async Task MoveShape(int x, int y)
        {
            await Clients.Others.SendAsync("shapeMoved", x, y);
        }
    }
}
