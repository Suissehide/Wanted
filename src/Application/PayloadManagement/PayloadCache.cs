using System.Collections.Concurrent;
using Wanted.Application.CursorEntity;

namespace Wanted.Application.PayloadManagement
{
    public class PayloadCache
    {
        ConcurrentDictionary<string, ConcurrentDictionary<int, bool>> _lastCache;
        ConcurrentDictionary<string, ConcurrentDictionary<int, bool>> _currentCache;

        public PayloadCache()
        {
            // Initiate base cache containers
            _currentCache = new ConcurrentDictionary<string, ConcurrentDictionary<int, bool>>();
            _lastCache = new ConcurrentDictionary<string, ConcurrentDictionary<int, bool>>();
        }

        public void StartNextPayloadCache()
        {
            _lastCache = _currentCache;
            _currentCache = new ConcurrentDictionary<string, ConcurrentDictionary<int, bool>>();
        }

        public void CreateCacheFor(string connectionId)
        {
            _currentCache.TryAdd(connectionId, new ConcurrentDictionary<int, bool>());
        }

        public void Cache(string connectionId, Cursor obj)
        {
            _currentCache[connectionId].TryAdd(obj.ServerId(), true);
        }

        public bool ExistedLastPayload(string connectionId, Cursor obj)
        {
            return _lastCache.ContainsKey(connectionId) && _lastCache[connectionId].ContainsKey(obj.ServerId());
        }
    }
}
