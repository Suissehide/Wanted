namespace Wanted.Application.Configuration
{
    public class GameConfigurationManager
    {
        public GameConfigurationManager()
        {
            GameConfig = new GameConfiguration();
            ScreenConfig = new ScreenConfiguration();
            LeaderboardConfig = new LeaderboardConfiguration();
            RuntimeConfig = new RuntimeConfiguration();
            CursorConfig = new CursorConfiguration();
        }

        // Game Configurations
        public GameConfiguration GameConfig { get; set; }

        // Screen Configurations
        public ScreenConfiguration ScreenConfig { get; set; }

        // Leaderboard Configurations
        public LeaderboardConfiguration LeaderboardConfig { get; set; }

        // Runtime Configurations
        public RuntimeConfiguration RuntimeConfig { get; set; }

        // Cursor Configurations
        public CursorConfiguration CursorConfig { get; set; }
    }
}
