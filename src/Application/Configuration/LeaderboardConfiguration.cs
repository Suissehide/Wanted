using Newtonsoft.Json;

namespace Wanted.Application.Configuration
{
    public class LeaderboardConfiguration
    {
        public LeaderboardConfiguration()
        {
            LEADERBOARD_SIZE = 4;
        }

        [JsonProperty(PropertyName = "leaderboardSize")]
        public int LEADERBOARD_SIZE { get; set; }
    }
}
