using Wanted.Application.CursorEntity;
using Wanted.Application.Utilities;

namespace Wanted.Application.GenericManagers
{
    public class GameHandler
    {
        private readonly CursorManager _cursorManager;
        private readonly Map _map;

        public GameHandler(Map map, Game game)
        {
            _map = map;
            _cursorManager = new CursorManager(this, game);
        }

        public void AddCursorToGame(Cursor cursor)
        {
            if (cursor != null)
            {
                _cursorManager.Add(cursor);
                _map.Insert(cursor);
            }
        }

        public void RemoveCursorFromGame(Cursor cursor)
        {
            if (cursor != null)
            {
                _cursorManager.Remove(cursor.Host.ConnectionId);
                _map.Remove(cursor);
            }
        }

        public void Update(GameTime gameTime)
        {
            _cursorManager.Update(gameTime);
        }
    }
}
