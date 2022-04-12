namespace Wanted.Application.Configuration
{
    public class GameConfigurationManager
    {
        public GameConfigurationManager()
        {
            gameConfig = new GameConfiguration();
            screenConfig = new ScreenConfiguration();
            leaderboardConfig = new LeaderboardConfiguration();
            runtimeConfig = new RuntimeConfiguration();
        }

        // Game Configurations
        public GameConfiguration gameConfig { get; set; }

        // Screen Configurations
        public ScreenConfiguration screenConfig { get; set; }

        // Leaderboard Configurations
        public LeaderboardConfiguration leaderboardConfig { get; set; }

        // Runtime Configurations
        public RuntimeConfiguration runtimeConfig { get; set; }
    }
}
