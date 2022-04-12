namespace Wanted.Application.Configuration
{
    public class ScreenConfiguration
    {
        public ScreenConfiguration()
        {
            SCREEN_BUFFER_AREA = 200;
            MAX_SCREEN_WIDTH = 2000;
            MAX_SCREEN_HEIGHT = 2000;
            MIN_SCREEN_WIDTH = 1000;
            MIN_SCREEN_HEIGHT = 660;
        }

        public int SCREEN_BUFFER_AREA { get; set; }
        public int MAX_SCREEN_WIDTH { get; set; }
        public int MAX_SCREEN_HEIGHT { get; set; }
        public int MIN_SCREEN_WIDTH { get; set; }
        public int MIN_SCREEN_HEIGHT { get; set; }
    }
}
