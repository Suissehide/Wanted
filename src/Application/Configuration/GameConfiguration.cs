namespace Wanted.Application.Configuration
{
    public class GameConfiguration
    {
        public GameConfiguration()
        {
            // How frequently the Update loop is executed
            UPDATE_INTERVAL = 20;
            // How frequently the Draw loop is executed.  Draw is what triggers the client side pings
            DRAW_INTERVAL = 40;
            // 1 time per second push leaderboard
            LEADERBOARD_PUSH_INTERVAL = 1000;
            // Every X state changes request a ping back
            REQUEST_PING_EVERY = 5;
        }

        public int DRAW_INTERVAL { get; set; }
        public int UPDATE_INTERVAL { get; set; }
        public int LEADERBOARD_PUSH_INTERVAL { get; set; }
        public int REQUEST_PING_EVERY { get; set; }
    }
}
