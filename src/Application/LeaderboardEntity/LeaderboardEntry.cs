namespace Wanted.Application.LeaderboardEntity
{
    public class LeaderboardEntry
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int Wins { get; set; }

        public string ConnectionId { get; set; }
    }
}
