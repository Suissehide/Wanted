namespace Wanted.Application.Configuration
{
    public class RuntimeConfiguration
    {
        public RuntimeConfiguration()
        {
            MaxServerUsers = 2000;
        }

        public int MaxServerUsers { get; set; }
    }
}
