using Microsoft.AspNetCore.SignalR;
using System.Numerics;
using Wanted.Application;
using Wanted.Application.CursorEntity;

namespace Wanted.Hubs
{
    public class MainHub : Hub
    {
        private readonly Game _game;
        private readonly ILogger _logger;

        public MainHub(Game game, ILogger<MainHub> logger)
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

        public void ReadyForPayloads()
        {
            try
            {
                var user = _game.UserHandler.GetUser(Context.ConnectionId);
                if (user is not null) user.ReadyForPayloads = true;
            }
            catch (Exception e)
            {
                _logger.LogError("readyForPayloads", e);
            }
        }

        public object? InitializeClient(string registrationId)
        {
            if (_game.RegistrationHandler.RegistrationExists(registrationId))
            {
                return _game.InitializeClient(Context.ConnectionId, _game.RegistrationHandler.RemoveRegistration(registrationId));
            }
            return null;
        }

        /// <summary>
        /// Registers the movement on a client. Fires when the client move mouse.
        /// </summary>
        public async Task RegisterMove(bool isMoving, Vector2 at, bool pingBack)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                try
                {
                    if (pingBack)
                    {
                        await Clients.Client(Context.ConnectionId).SendAsync("pingBack");
                    }

                    Cursor? cursor = _game.UserHandler.GetUserCursor(Context.ConnectionId);
                    cursor?.RegisterMove(isMoving, at);
                }
                catch (Exception e)
                {
                    _logger.LogError("registerMoveStart", e);
                }
            }
        }

        /// <summary>
        /// Called when a player click
        /// </summary>
        public double Click()
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {

                    Cursor? cursor = _game.UserHandler.GetUserCursor(Context.ConnectionId);

                    /*
                    if (cursor.Controllable.Value)
                    {
                        cursor.WeaponController.Fire(DateTime.UtcNow);
                    }
                    return cursor.WeaponController.Energy;
                    */

                }
                throw new Exception("Could not find user when clicking.");

            }
            catch (Exception e)
            {
                _logger.LogError("click", e);
            }

            return 0;
        }

        /// <summary>
        /// Called when a cursor starts firing a stream of bullet at the maximum possible rate
        /// </summary>
        public void StartClick()
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                try
                {
                    Cursor? cursor = _game.UserHandler.GetUserCursor(Context.ConnectionId);

                    /*
                    if (cursor.Controllable.Value)
                    {
                        cursor.WeaponController.AutoFire = true;
                    }
                    */
                }
                catch (Exception e)
                {
                    _logger.LogError("startClick", e);
                }
            }
        }

        /// <summary>
        /// Called when a cursor stops firing a stream of bullet
        /// </summary>
        public double StopClick()
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                try
                {
                    Cursor? cursor = _game.UserHandler.GetUserCursor(Context.ConnectionId);

                    //cursor.WeaponController.AutoFire = false;
                    //return cursor.WeaponController.Energy;
                }
                catch (Exception e)
                {
                    _logger.LogError("stopClick", e);
                }
            }

            return 0;
        }

        public async Task ReadyForLeaderboardPayloads()
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    var user = _game.UserHandler.GetUser(Context.ConnectionId);
                    if (user is not null) user.IdleManager.RecordActivity();
                    await _game.Leaderboard.RequestLeaderboardAsync(Context.ConnectionId);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("readyForLeaderboardPayloads", e);
            }
        }

        public async Task StopLeaderboardPayloads()
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    var user = _game.UserHandler.GetUser(Context.ConnectionId);
                    if (user is not null) user.IdleManager.RecordActivity();
                    await _game.Leaderboard.StopRequestingLeaderboardAsync(Context.ConnectionId);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("stopLeaderboardPayloads", e);
            }
        }

        public async Task SendMessage(string message)
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    Cursor? cursor = _game.UserHandler.GetUserCursor(Context.ConnectionId);
                    var from = cursor?.Name;

                    //TODO: send a message to #wanter using the jabbr c# client later
                    await Clients.AllExcept(new List<string> { Context.ConnectionId }).SendAsync("chatMessage", from, message, 0 /* standard message */);
                }
            }
            catch (Exception e)
            {
                _logger.LogError("sendMessage", e);
            }
        }
    }
}
