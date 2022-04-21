using Microsoft.AspNetCore.SignalR;
using System.Drawing;
using Wanted.Application.CursorEntity;
using Wanted.Application.Registration;
using Wanted.Hubs;

namespace Wanted.Application.UserEntity
{
    public class User
    {
        public const int MAX_SCREEN_WIDTH = 2000;
        public const int MAX_SCREEN_HEIGHT = 2000;
        public const int MIN_SCREEN_WIDTH = 1000;
        public const int MIN_SCREEN_HEIGHT = 660;

        private Size _viewport;
        public List<User> RemoteControllers { get; } = new List<User>();

        public User(string connectionId, Cursor cursor, RegisteredClient rc)
        {
            RegistrationTicket = rc;
            MyCursor = cursor;
            ConnectionId = connectionId;

            Viewport = new Size(0, 0); // Initialize the viewport to 0 by 0

            NotificationManager = new NotificationManager();
            IdleManager = new IdleManager(cursor, NotificationManager);
            Connected = true;
            ReadyForPayloads = false;

            if (cursor != null)
            {
                cursor.Host = this;
            }
        }

        public Cursor MyCursor { get; set; }
        public string ConnectionId { get; set; }
        public bool Controller { get; set; }
        public bool Connected { get; set; }
        public RegisteredClient RegistrationTicket { get; set; }
        public NotificationManager NotificationManager { get; private set; }
        public IdleManager IdleManager { get; private set; }
        public int CurrentLeaderboardPosition { get; set; }
        public bool ReadyForPayloads { get; set; }

        public Size Viewport
        {
            get
            {
                return _viewport;
            }
            set
            {
                if (value.Width > MAX_SCREEN_WIDTH)
                {
                    value.Width = MAX_SCREEN_WIDTH;
                }
                if (value.Height > MAX_SCREEN_HEIGHT)
                {
                    value.Height = MAX_SCREEN_HEIGHT;
                }

                _viewport = value;
            }
        }

        public virtual Task PushToClientAsync(object[] payload, IHubContext<MainHub> context)
        {
            return context.Clients.Client(ConnectionId).SendAsync("d", payload);
        }

        public void Update()
        {
            if (MyCursor != null)
            {
                IdleManager.Update();
            }
        }
    }
}
