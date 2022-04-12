using Microsoft.AspNetCore.SignalR;
using Wanted.Application.CursorEntity;
using Wanted.Hubs;

namespace Wanted.Application.Utilities
{
    public class Map
    {
        private readonly List<Cursor> _allObjects;
        private readonly IHubContext<MainHub> _mainHub;

        private readonly object _insertLock = new object();

        public Map(Game game, IHubContext<MainHub> mainHub)
        {
            // Double collidable for fast removes/inserts
            _allObjects = new List<Cursor>();
            _mainHub = mainHub;
        }

        public void Insert(Cursor obj)
        {
            lock (_insertLock)
            {
                _allObjects.Add(obj);
            }
        }

        public bool Contains(Cursor obj)
        {
            return _allObjects.Contains(obj);
        }

        public void Remove(Cursor obj)
        {
            _allObjects.Remove(obj);

        }

        public List<Cursor> GetAll()
        {
            return _allObjects;
        }

        public void Clean()
        {
            for (int i = 0; i < _allObjects.Count; i++)
            {
                if (_allObjects[i].Disposed)
                {
                    Remove(_allObjects[i--]);
                }
                else
                {
                    _allObjects[i].ResetFlags();
                }
            }
        }
    }
}
