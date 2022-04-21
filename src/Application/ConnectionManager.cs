using Microsoft.AspNetCore.SignalR;
using Wanted.Application.LeaderboardEntity;
using Wanted.Application.UserEntity;
using Wanted.Hubs;

namespace Wanted.Application
{
    public class ConnectionManager
    {
        private readonly SemaphoreSlim _gameLock;
        private readonly UserHandler _userHandler;
        private readonly IHubContext<MainHub> _mainHub;

        public ConnectionManager(UserHandler userHandler, SemaphoreSlim gameLock, IHubContext<MainHub> mainHub)
        {
            _userHandler = userHandler;
            _gameLock = gameLock;
            _mainHub = mainHub;
        }

        public void OnConnected(string connectionId)
        {
        }

        public async Task OnDisconnectedAsync(string connectionId)
        {
            await _gameLock.WaitAsync();
            try
            {
                if (_userHandler.UserExistsAndReady(connectionId))
                {
                    User user = _userHandler.GetUser(connectionId);

                    //It's possible for a controller to disconnect without a cursor
                    if (!user.Controller)
                    {
                        user.MyCursor.Dispose();
                        user.Connected = false;
                    }
                    else
                    {
                        // Remove me from the cursor hosts remote controllers
                        if (user.MyCursor != null)
                        {
                            user.MyCursor.Host.RemoteControllers.Remove(user);
                            user.MyCursor.Host.NotificationManager.Notify("Detached controller.");
                            user.MyCursor = null;
                        }

                        _userHandler.RemoveUser(connectionId);
                    }

                    // Leave the leaderboard group just in case user was in it
                    await _mainHub.Groups.RemoveFromGroupAsync(connectionId, Leaderboard.LEADERBOARD_REQUESTEE_GROUP);

                    // Clear controllers
                    foreach (User u in user.RemoteControllers)
                    {
                        u.MyCursor = null;
                        await _mainHub.Clients.Client(u.ConnectionId).SendAsync("stopController", "Primary account has been stopped!");
                    }

                    user.RemoteControllers.Clear();
                }
            }
            catch (Exception e)
            {
                //ErrorLog.Instance.Log(e);
            }
            finally
            {
                _gameLock.Release();
            }
        }
    }
}