using System.Collections.Concurrent;
using System.Numerics;
using Wanted.Application.UserEntity;
using Wanted.Application.Utilities;

namespace Wanted.Application.CursorEntity
{
    public class Cursor
    {
        public const int WIDTH = 75;
        public const int HEIGHT = 75;

        private static int _itemCount = 0;
        private static int _cursorGUID = 0;

        private int _serverId = 0;
        protected bool _altered = true;

        private readonly ConcurrentQueue<Action> _enqueuedCommands;
        private readonly Game _game;

        public Cursor(Game game)
        {
            _game = game;
            Id = Interlocked.Increment(ref _cursorGUID);
            _serverId = Interlocked.Increment(ref _itemCount);
            StatRecorder = new CursorStatRecorder(this);

            _enqueuedCommands = new ConcurrentQueue<Action>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public User? Host { get; set; }
        public Vector2 Position { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool Disposed { get; set; }

        public virtual CursorStatRecorder StatRecorder { get; protected set; }

        public int ServerId()
        {
            return _serverId;
        }

        public bool Altered()
        {
            return _altered;
        }

        public virtual void ResetFlags()
        {
            _altered = false;
        }

        /// <summary>
        /// Does not null out the object.  Simply used to represent when an object is no longer needed in the game world.
        /// </summary>
        public void Dispose()
        {
            Disposed = true;
        }

        public void RegisterMove(bool isMoving, Vector2 at)
        {
            // System.Diagnostics.Debug.WriteLine("Move: ", at.X, " : ", at.Y);

            Host?.IdleManager.RecordActivity();

            _enqueuedCommands.Enqueue(() =>
            {
                Position = at;
            });
        }

        public virtual void Update(GameTime gameTime)
        {
            LastUpdated = DateTime.UtcNow;


            while (!_enqueuedCommands.IsEmpty)
            {
                if (_enqueuedCommands.TryDequeue(out Action? command) && !this.Disposed)
                {
                    command();
                }
            }
        }
    }
}
