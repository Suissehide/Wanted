using Wanted.Application.CursorEntity;

namespace Wanted.Application.UserEntity
{
    public class IdleManager
    {
        private static readonly TimeSpan IDLE_AFTER = TimeSpan.FromSeconds(120); // Go idle after X seconds with no communication to the server
        private static readonly TimeSpan DISCONNECT_AFTER = TimeSpan.FromMinutes(15); // Disconnect after X hours of being idle

        public event Action<Cursor> OnIdle;
        public event Action<User> OnIdleTimeout;
        public event Action<Cursor> OnComeBack;

        private DateTime _lastActive;
        private DateTime? _idleAt;
        private NotificationManager _notificationManager;
        private Cursor _me;

        public IdleManager(Cursor me, NotificationManager notificationManager)
        {
            _lastActive = DateTime.UtcNow;
            _notificationManager = notificationManager;
            _me = me;
            Idle = false;
        }

        public bool Idle { get; set; }

        public void RecordActivity()
        {
            _lastActive = DateTime.UtcNow;
        }

        public void GoIdle(DateTime now)
        {
            if (Idle == false)
            {
                _idleAt = now;
                Idle = true;

                if (_me.Host.Connected)
                {
                    _notificationManager.Notify("You are now AFK! You will not see any new cursor on screen.");
                }

                if (OnIdle != null)
                {
                    OnIdle(_me);
                }
            }
        }

        public void ComeBack()
        {
            if (Idle == true)
            {
                Idle = false;

                if (_me.Host.Connected)
                {
                    _notificationManager.Notify("You are back!");
                }

                if (OnComeBack != null)
                {
                    OnComeBack(_me);
                }
            }
        }

        public void Update()
        {
            var now = DateTime.UtcNow;
            if (now - _lastActive >= IDLE_AFTER) // Idle
            {
                // This is here for performance
                // Check if we've clicked to prevent idle
                /*
                if (now - _me.ClickController.LastClick < IDLE_AFTER)
                {
                    _lastActive = _me.ClickController.LastFired;
                    ComeBack();
                    return;
                }
                */

                // Need to disconnect
                if (_idleAt.HasValue && now - _idleAt >= DISCONNECT_AFTER)
                {
                    _idleAt = null;
                    if (OnIdleTimeout != null)
                    {
                        OnIdleTimeout(_me.Host);
                    }
                }
                else
                {
                    GoIdle(now);
                }
            }
            else // Still here
            {
                _idleAt = null;
                ComeBack();
            }
        }
    }
}
