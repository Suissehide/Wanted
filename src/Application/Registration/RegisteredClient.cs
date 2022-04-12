namespace Wanted.Application.Registration
{
    public class RegisteredClient
    {
        public RegisteredClient(string registrationID, string identity, string displayName)
        {
            RegistrationID = registrationID;
            Identity = identity;
            DisplayName = displayName;
        }

        public string RegistrationID { get; set; }
        public string Identity { get; set; }
        public string DisplayName { get; set; }
    }
}
