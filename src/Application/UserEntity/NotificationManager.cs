namespace Wanted.Application.UserEntity
{
    public class NotificationManager
    {
        private string? _notification;
        private bool _hasNotification;

        public NotificationManager()
        {
            _hasNotification = false;
        }

        public void Notify(string notification)
        {
            _hasNotification = true;
            _notification = notification;
        }

        public bool HasNotification()
        {
            return _hasNotification;
        }

        public string? PullNotification()
        {
            if (HasNotification())
            {
                string? temp = _notification;
                _notification = null;
                _hasNotification = false;
                return temp;
            }
            return null;
        }
    }
}
