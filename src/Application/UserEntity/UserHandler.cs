using System.Collections.Concurrent;
using Wanted.Application.Configuration;
using Wanted.Application.CursorEntity;
using Wanted.Application.GenericManagers;

namespace Wanted.Application.UserEntity
{
    public class UserHandler
    {
        private readonly ConcurrentDictionary<string, User> _userList = new ConcurrentDictionary<string, User>();
        private readonly GameHandler _gameHandler;
        private readonly GameConfigurationManager _configuration;

        public int TotalActiveUsers { get; set; }

        public UserHandler(GameHandler gameHandler, GameConfigurationManager configuration)
        {
            _gameHandler = gameHandler;
            _configuration = configuration;
        }

        public void AddUser(User user)
        {
            _userList.TryAdd(user.ConnectionId, user);
            user.IdleManager.OnIdle += _gameHandler.RemoveCursorFromGame;
            //user.IdleManager.OnIdleTimeout += DisconnectUser;
            user.IdleManager.OnComeBack += _gameHandler.AddCursorToGame;
        }

        public void RemoveUser(string connectionId)
        {
            if (_userList.TryRemove(connectionId, out var u) && u.MyCursor != null)
            {
                u.MyCursor.Dispose();
                u.MyCursor.Host = null; // Remove linking from the cursor
            }
        }

        public Cursor? GetUserCursor(string connectionId)
        {
            return _userList[connectionId].MyCursor;
        }


        public bool UserExistsAndReady(string connectionId)
        {
            return _userList.ContainsKey(connectionId) && _userList[connectionId].MyCursor != null;
        }

        public User? GetUser(string? connectionId)
        {
            if (!string.IsNullOrEmpty(connectionId))
                return _userList[connectionId];
            return null;
        }

        public List<User> GetUsers()
        {
            return _userList.Values.ToList();
        }

        public List<User> GetActiveUsers()
        {
            List<User> activeUsers = (from user in _userList.Values
                                      where user.Connected && !user.IdleManager.Idle
                                      select user).ToList();

            TotalActiveUsers = activeUsers.Count;

            return activeUsers;
        }

        public void Update()
        {
            foreach (User user in _userList.Values)
            {
                user.Update();
            }
        }
    }
}
