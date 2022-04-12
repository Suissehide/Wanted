using System.Collections.Concurrent;
using System.Drawing;
using System.Numerics;
using Wanted.Application.CursorEntity;
using Wanted.Application.LeaderboardEntity;
using Wanted.Application.UserEntity;
using Wanted.Application.Utilities;

namespace Wanted.Application.PayloadManagement
{
    public class PayloadManager
    {
        public const int SCREEN_BUFFER_AREA = 200; // Send X extra pixels down to the client to allow for latency between client and server

        public PayloadCompressor Compressor = new PayloadCompressor();

        private PayloadCache _payloadCache = new PayloadCache();

        public ConcurrentDictionary<string, object[]> GetGamePayloads(ICollection<User> userList, int playerCount, Map map)
        {
            _payloadCache.StartNextPayloadCache();

            ConcurrentDictionary<string, object[]> payloads = new ConcurrentDictionary<string, object[]>();

            Parallel.ForEach(userList, user =>
            {
                if (user.ReadyForPayloads && user.Connected)
                {
                    string connectionId = user.ConnectionId;

                    _payloadCache.CreateCacheFor(connectionId);

                    var payload = GetInitializedPayload(playerCount, user);

                    if (!user.IdleManager.Idle)
                    {
                        List<Cursor> onScreen = map.GetAll();

                        foreach (Cursor obj in onScreen)
                        {
                            payload.Cursors.Add(Compressor.Compress(obj));
                        }
                    }
                    else // User is Idle, push down "MyCursor"
                    {
                        payload.Cursors.Add(Compressor.Compress(user.MyCursor));
                    }

                    // This is used to send down "death" data a single time to the client and not send it repeatedly
                    /*
                    if (user.WinOccured)
                    {
                        // We've acknowledged the death
                        user.WinOccured = false;
                        payload.WinByName = user.MyCursor.LastWinBy.Host.RegistrationTicket.DisplayName;
                    }
                    */

                    if (user.Connected)
                    {
                        payloads.TryAdd(connectionId, Compressor.Compress(payload));
                    }
                }
            });

            // Remove all disposed objects from the map
            //_map.Clean();

            return payloads;
        }

        public List<object> GetLeaderboardPayloads(IEnumerable<LeaderboardEntry> leaderboard)
        {
            var result = new List<object>();

            foreach (var entry in leaderboard)
            {
                result.Add(Compressor.Compress(entry));
            }

            return result;
        }

        public Payload GetInitializedPayload(int playerCount, User user)
        {
            return new Payload()
            {
                LeaderboardPosition = user.CurrentLeaderboardPosition,
                Wins = user.MyCursor.StatRecorder.Wins,
                CursorsInWorld = playerCount,
                Notification = user.NotificationManager.PullNotification(),
            };
        }
    }
}
