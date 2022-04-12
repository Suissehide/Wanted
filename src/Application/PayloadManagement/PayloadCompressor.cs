using Wanted.Application.CursorEntity;
using Wanted.Application.LeaderboardEntity;
using Wanted.Application.PayloadManagement.CompressionContracts;

namespace Wanted.Application.PayloadManagement
{
    public class PayloadCompressor
    {
        public PayloadCompressionContract PayloadCompressionContract = new PayloadCompressionContract();
        public CursorCompressionContract CursorCompressionContract = new CursorCompressionContract();
        public LeaderboardEntryCompressionContract LeaderboardEntryCompressionContract = new LeaderboardEntryCompressionContract();

        public object[] Compress(Cursor cursor)
        {
            object[] result = new object[6];

            result[CursorCompressionContract.PositionX] = Math.Round(cursor.Position.X, 2);
            result[CursorCompressionContract.PositionY] = Math.Round(cursor.Position.Y, 2);
            result[CursorCompressionContract.Id] = cursor.Id;
            result[CursorCompressionContract.Disposed] = Convert.ToInt32(cursor.Disposed);
            result[CursorCompressionContract.Name] = cursor.Name;
            result[CursorCompressionContract.Wins] = cursor.StatRecorder.Wins;

            return result;
        }

        public object[] Compress(Payload payload)
        {
            object[] result = new object[5];

            result[PayloadCompressionContract.Cursors] = payload.Cursors;
            result[PayloadCompressionContract.LeaderboardPosition] = payload.LeaderboardPosition;
            result[PayloadCompressionContract.CursorsInWorld] = payload.CursorsInWorld;
            result[PayloadCompressionContract.Notification] = payload.Notification;
            result[PayloadCompressionContract.LastCommandProcessed] = payload.LastCommandProcessed;

            return result;
        }

        public object[] Compress(LeaderboardEntry leaderboardEntry)
        {
            object[] result = new object[3];

            result[LeaderboardEntryCompressionContract.Name] = leaderboardEntry.Name;
            result[LeaderboardEntryCompressionContract.Id] = leaderboardEntry.Id;
            result[LeaderboardEntryCompressionContract.Wins] = leaderboardEntry.Wins;

            return result;
        }
    }
}
