namespace Wanted.Application.CursorEntity
{
    public class CursorStatRecorder
    {
        protected Cursor _me;

        public CursorStatRecorder(Cursor me)
        {
            _me = me;
        }

        public int Wins { get; set; }

        public void CursorWin()
        {
            Wins++;
        }

        public void Reset()
        {
            Wins = 0;
        }
    }
}
