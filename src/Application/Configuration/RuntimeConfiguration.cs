using Newtonsoft.Json;

namespace Wanted.Application.Configuration
{
    public class RuntimeConfiguration
    {
        public RuntimeConfiguration()
        {
            MAX_SERVER_USERS = 2000;
        }

        [JsonProperty(PropertyName = "maxServerUsers")]
        public int MAX_SERVER_USERS { get; set; }
    }
}
