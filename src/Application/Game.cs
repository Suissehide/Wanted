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
        private PayloadManager _payloadManager;
        private HighFrequencyTimer _gameLoop;
        private GameTime _gameTime;
        private readonly Map _map;
        private readonly SemaphoreSlim _gameLock = new SemaphoreSlim(1, 1);
        private int DRAW_AFTER;
        private IHubContext<MainHub> _mainHub;
        private Timer _leaderboardLoop;

        private long _actualFPS = 0;
        private long _drawCount = 0;
        private long _drawFPS = 0;

        public Game(IHubContext<MainHub> mainHub)
        {
            RegistrationHandler = new RegistrationHandler();
            Configuration = new GameConfigurationManager();

            _gameLoop = new HighFrequencyTimer(1000 / Configuration.gameConfig.UPDATE_INTERVAL, async id => await Update(id), () => { }, () => { }, (fps) =>
            {
                _actualFPS = fps;
            });
            _mainHub = mainHub;


            _leaderboardLoop = new Timer(UpdateLeaderboard, null, Configuration.gameConfig.LEADERBOARD_PUSH_INTERVAL, Configuration.gameConfig.LEADERBOARD_PUSH_INTERVAL);

            DRAW_AFTER = Configuration.gameConfig.DRAW_INTERVAL / Configuration.gameConfig.UPDATE_INTERVAL;
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

                await GameHandler.Update(_gameTime);

                if (_actualFPS <= _drawFPS || (++_drawCount) % DRAW_AFTER == 0)
                {
                    await DrawAsync();
                    _drawCount = 0;
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

            return id;
        }


        /// <summary>
        /// Sends down batches of data to the clients in order to update their screens
        /// </summary>
        private async Task DrawAsync()
        {
            UserHandler.Update();

            var payloads = _payloadManager.GetGamePayloads(UserHandler.GetUsers(), UserHandler.TotalActiveUsers, _map);

            foreach (string connectionID in payloads.Keys)
            {
                await UserHandler.GetUser(connectionID).PushToClientAsync(payloads[connectionID], _mainHub);
            }
        }

        /// <summary>
        /// Retrieves the game's configuration
        /// </summary>
        /// <returns>The game's configuration</returns>
        public object initializeClient(string connectionId, RegisteredClient rc)
        {
            if (!UserHandler.UserExistsAndReady(connectionId))
            {
                _gameLock.Wait();
                try
                {
                    User user = null; //UserHandler.FindUserByIdentity(rc.Identity);
                    Cursor cursor = null;

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
                            cursor = new Cursor(this);
                            cursor.Name = rc.DisplayName;
                            user = new User(connectionId, cursor, rc) { Controller = false };
                            UserHandler.AddUser(user);
                        }
                    }

                    GameHandler.AddCursorToGame(cursor);

                    return new
                    {
                        Configuration = Configuration,
                        ServerFull = false,
                        CompressionContracts = new
                        {
                            PayloadContract = _payloadManager.Compressor.PayloadCompressionContract,
                            CursorContract = _payloadManager.Compressor.CursorCompressionContract,
                            LeaderboardEntryContract = _payloadManager.Compressor.LeaderboardEntryCompressionContract,
                        },
                        ShipId = UserHandler.GetUserCursor(connectionId).Id,
                        ShipName = UserHandler.GetUserCursor(connectionId).Name
                    };
                }
                catch
                { }
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
                //ErrorLog.Instance.Log(e);
            }
        }

        private async Task PushLeaderboardAsync(List<object> leaderboard)
        {
            await _mainHub.Clients.Group(Leaderboard.LEADERBOARD_REQUESTEE_GROUP).SendAsync("l", leaderboard);
        }
    }
}
