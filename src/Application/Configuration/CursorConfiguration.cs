using Newtonsoft.Json;

namespace Wanted.Application.Configuration
{
    public class CursorConfiguration
    {
        public CursorConfiguration()
        {
            MIN_FIRE_RATE = 140;
        }

        [JsonProperty(PropertyName = "minFireRate")]
        public int MIN_FIRE_RATE { get; set; }
    }
}
