namespace Wanted.Application.PayloadManagement
{
    public class Payload
    {
        public Payload()
        {
            Cursors = new List<object>();
        }

        public List<object> Cursors { get; set; }

        public int CursorsInWorld { get; set; }

        public string Notification { get; set; }
        public long LastCommandProcessed { get; set; }

        public int LeaderboardPosition { get; set; }
        public int Wins { get; set; }
    }
}
