using Microsoft.AspNetCore.SignalR;
using Wanted.Application.Configuration;
using Wanted.Application.CursorEntity;
using Wanted.Application.GenericManagers;
using Wanted.Application.LeaderboardEntity;
using Wanted.Application.PayloadManagement;
using Wanted.Application.Registration;
using Wanted.Application.UserEntity;
using Wanted.Application.Utilities;
using Wanted.Hubs;

namespace Wanted.Application
{
    public class Game
    {
        private readonly PayloadManager _payloadManager;
        private readonly HighFrequencyTimer _gameLoop;
        private readonly GameTime _gameTime;
        private readonly Map _map;
        private readonly SemaphoreSlim _gameLock = new(1, 1);
        private readonly int DRAW_AFTER;
        private readonly IHubContext<MainHub> _mainHub;
        private readonly Timer _leaderboardLoop;

        private long _actualFPS = 0;
        private long _drawCount = 0;
        private readonly long _drawFPS = 0;

        public Game(IHubContext<MainHub> mainHub)
        {
            RegistrationHandler = new RegistrationHandler();
            Configuration = new GameConfigurationManager();

            _gameLoop = new HighFrequencyTimer(1000 / Configuration.GameConfig.UPDATE_INTERVAL, async id => await Update(id), () => { }, () => { }, (fps) =>
            {
                _actualFPS = fps;
            });
            _mainHub = mainHub;

            _leaderboardLoop = new Timer(UpdateLeaderboard!, null, Configuration.GameConfig.LEADERBOARD_PUSH_INTERVAL, Configuration.GameConfig.LEADERBOARD_PUSH_INTERVAL);

            DRAW_AFTER = Configuration.GameConfig.DRAW_INTERVAL / Configuration.GameConfig.UPDATE_INTERVAL;
            _gameTime = new GameTime();
            _map = new Map(this, mainHub);
            _payloadManager = new PayloadManager();
            GameHandler = new GameHandler(_map, this);
            UserHandler = new UserHandler(GameHandler, Configuration);
            Leaderboard = new Leaderboard(UserHandler, mainHub);
            ConnectionManager = new ConnectionManager(UserHandler, _gameLock, mainHub);

            _gameLoop.Start();
        }
        public RegistrationHandler RegistrationHandler { get; private set; }
        public GameConfigurationManager Configuration { get; set; }
        public ConnectionManager ConnectionManager { get; private set; }
        public GameHandler GameHandler { get; private set; }    
        public UserHandler UserHandler { get; private set; }    
        public Leaderboard Leaderboard { get; }

        /// <summary>
        ///
        /// </summary>
        private async Task<long> Update(long id)
        {
            await _gameLock.WaitAsync();
            try
            {
                var utcNow = DateTime.UtcNow;
                _gameTime.Update(utcNow);

                GameHandler.Update(_gameTime);

                if (_actualFPS <= _drawFPS || (++_drawCount) % DRAW_AFTER == 0)
                {
                    await DrawAsync();
                    _drawCount = 0;
                }
            }
            catch (Exception e)
            {
                ErrorLog.Instance.Log(e);
            }
            finally
            {
                _gameLock.Release();
            }

            return id;
        }

        /// <summary>
        /// Sends down batches of data to the clients in order to update their screens
        /// </summary>
        private async Task DrawAsync()
        {
            UserHandler.Update();

            var payloads = _payloadManager.GetGamePayloads(UserHandler.GetUsers(), UserHandler.TotalActiveUsers, _map);

            foreach (string connectionId in payloads.Keys)
            {
                // System.Diagnostics.Debug.WriteLine(JsonConvert.SerializeObject(payloads[connectionId]));
                var user = UserHandler.GetUser(connectionId);
                if (user is not null) await user.PushToClientAsync(payloads[connectionId], _mainHub);
            }
        }

        /// <summary>
        /// Retrieves the game's configuration
        /// </summary>
        /// <returns>The game's configuration</returns>
        public object? InitializeClient(string connectionId, RegisteredClient? rc)
        {
            if (!UserHandler.UserExistsAndReady(connectionId))
            {
                _gameLock.Wait();
                try
                {
                    User? user = null; //UserHandler.FindUserByIdentity(rc.Identity);
                    Cursor? cursor = null;

                    if (user == null)
                    {
                        if (UserHandler.TotalActiveUsers >= 42/*RuntimeConfiguration.MaxServerUsers*/)
                        {
                            return new
                            {
                                ServerFull = true
                            };
                        }
                        else
                        {
                            cursor = new Cursor(this)
                            {
                                Name = rc?.DisplayName
                            };
                            user = new User(connectionId, cursor, rc) { Controller = false };
                            UserHandler.AddUser(user);
                        }
                    }

                    GameHandler.AddCursorToGame(cursor);

                    return new
                    {
                        Configuration,
                        ServerFull = false,
                        CompressionContracts = new
                        {
                            PayloadContract = _payloadManager.Compressor.PayloadCompressionContract,
                            CursorContract = _payloadManager.Compressor.CursorCompressionContract,
                            LeaderboardEntryContract = _payloadManager.Compressor.LeaderboardEntryCompressionContract,
                        },
                        CursorId = UserHandler?.GetUserCursor(connectionId)?.Id,
                        CursorName = UserHandler?.GetUserCursor(connectionId)?.Name
                    };
                }
                catch
                {
                    System.Diagnostics.Debug.WriteLine("Error: initialisation");
                }
                finally
                {
                    _gameLock.Release();
                }
            }
            return null;
        }

        private async void UpdateLeaderboard(object state)
        {
            // This will in-frequently throw an error due to race conditions.  Instead of locking I'd rather it fail in means of maintaining speed.
            try
            {
                var leaderboardEntries = _payloadManager.GetLeaderboardPayloads(Leaderboard.GetAndUpdateLeaderboard());

                await PushLeaderboardAsync(leaderboardEntries);
            }
            catch (Exception e)
            {
                ErrorLog.Instance.Log(e);
            }
        }

        private async Task PushLeaderboardAsync(List<object> leaderboard)
        {
            await _mainHub.Clients.Group(Leaderboard.LEADERBOARD_REQUESTEE_GROUP).SendAsync("l", leaderboard);
        }
    }
}
