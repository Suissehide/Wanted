namespace Wanted.Application.Registration
{
    public class RegisteredClient
    {
        public RegisteredClient(string registrationId, string identity, string displayName)
        {
            RegistrationId = registrationId;
            Identity = identity;
            DisplayName = displayName;
        }

        public string RegistrationId { get; set; }
        public string Identity { get; set; }
        public string DisplayName { get; set; }
    }
}
