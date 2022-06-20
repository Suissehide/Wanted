using Newtonsoft.Json;
using Wanted.Application.PayloadManagement;
using Wanted.Application.UserEntity;

namespace Wanted.Application.Configuration
{
    public class ScreenConfiguration
    {
        public ScreenConfiguration()
        {
            SCREEN_BUFFER_AREA = PayloadManager.SCREEN_BUFFER_AREA;
            MAX_SCREEN_WIDTH = User.MAX_SCREEN_WIDTH;
            MAX_SCREEN_HEIGHT = User.MAX_SCREEN_HEIGHT;
            MIN_SCREEN_WIDTH = User.MIN_SCREEN_WIDTH;
            MIN_SCREEN_HEIGHT = User.MIN_SCREEN_HEIGHT;
        }

        [JsonProperty(PropertyName = "screenBufferArea")]
        public int SCREEN_BUFFER_AREA { get; set; }
        
        [JsonProperty(PropertyName = "maxScreenWidth")]
        public int MAX_SCREEN_WIDTH { get; set; }
        
        [JsonProperty(PropertyName = "maxScreenHeight")]
        public int MAX_SCREEN_HEIGHT { get; set; }
        
        [JsonProperty(PropertyName = "minScreenWidth")]
        public int MIN_SCREEN_WIDTH { get; set; }

        [JsonProperty(PropertyName = "minScreenHeight")]
        public int MIN_SCREEN_HEIGHT { get; set; }
    }
}
