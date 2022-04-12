using System.Collections.Concurrent;
using Wanted.Application.GenericManagers;
using Wanted.Application.Utilities;

namespace Wanted.Application.CursorEntity
{
    public class CursorManager
    {
        public ConcurrentDictionary<string, Cursor> Cursors { get; } = new ConcurrentDictionary<string, Cursor>();

        public CursorManager(GameHandler gameHandler, Game game)
        {

        }

        /// <summary>
        /// Adds a cursor and returns the added cursor. Used to chain methods together.
        /// </summary>
        /// <param name="cursor">The cursor to add</param>
        public void Add(Cursor cursor)
        {
            Cursors.TryAdd(cursor.Host.ConnectionId, cursor);
        }

        /// <summary>
        /// Removes cursor from the game handler. This is used when a cursor is destroyed and no longer needs to be monitored.
        /// </summary>
        /// <param name="key"></param>
        public void Remove(string key)
        {
            Cursors.TryRemove(key, out var _);
        }

        public async Task Update(GameTime gameTime)
        {
            var keysToRemove = new List<string>(Cursors.Count);
            Parallel.ForEach(Cursors, currentCursor =>
            {
                if (!currentCursor.Value.Disposed)
                {
                    currentCursor.Value.Update(gameTime);
                }
                else
                {
                    keysToRemove.Add(currentCursor.Key);
                }

            });

            for (int i = keysToRemove.Count - 1; i >= 0; i--)
            {
                Remove(keysToRemove[i]);
            }
        }
    }
}
