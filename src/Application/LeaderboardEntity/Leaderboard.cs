using Microsoft.AspNetCore.SignalR;
using Wanted.Application.UserEntity;
using Wanted.Hubs;

namespace Wanted.Application.LeaderboardEntity
{
    public class Leaderboard
    {
        public const int LEADERBOARD_SIZE = 4;
        public const string LEADERBOARD_REQUESTEE_GROUP = "LeaderboardRequestees";

        private readonly UserHandler _userHandler;
        private readonly IHubContext<MainHub> _mainHub;

        public Leaderboard(UserHandler userHandler, IHubContext<MainHub> mainHub)
        {
            _userHandler = userHandler;
            _mainHub = mainHub;
        }

        public Task RequestLeaderboardAsync(string connectionId)
        {
            return _mainHub.Groups.AddToGroupAsync(connectionId, LEADERBOARD_REQUESTEE_GROUP);
        }

        public Task StopRequestingLeaderboardAsync(string connectionId)
        {
            return _mainHub.Groups.RemoveFromGroupAsync(connectionId, LEADERBOARD_REQUESTEE_GROUP);
        }

        public IEnumerable<LeaderboardEntry> GetAndUpdateLeaderboard()
        {
            IEnumerable<LeaderboardEntry> currentLeaderboard =
                (from user in _userHandler.GetActiveUsers()
                 where user.MyCursor != null
                 select user.MyCursor)
                .Select(cursor => new LeaderboardEntry()
                {
                    Name = cursor.Name,
                    Wins = cursor.StatRecorder.Wins,
                    Id = cursor.Id,
                    ConnectionId = cursor.Host.ConnectionId
                })
                .OrderByDescending(entry => entry.Wins)
                .ThenByDescending(entry => entry.Name);

            int i = 1;

            foreach (LeaderboardEntry entry in currentLeaderboard)
            {
                _userHandler.GetUser(entry.ConnectionId).CurrentLeaderboardPosition = i++;
            }

            return currentLeaderboard.Take(LEADERBOARD_SIZE);
        }
    }
}
