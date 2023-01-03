using System.Diagnostics;

namespace Wanted.Application.Utilities;

public class ErrorLog
{
    private readonly static Lazy<ErrorLog> _instance = new Lazy<ErrorLog>(() => new ErrorLog());
    readonly string sSource = ".NET Runtime";

    public void Log(Exception e, string customMessage = "")
    {
        Task.Factory.StartNew(() =>
        {
#pragma warning disable CA1416 // Validate platform compatibility
            EventLog.WriteEntry(sSource, e.ToString() + "      CALLSTACK: " + e.StackTrace + "      CUSTOM MESSAGE: " + customMessage);
#pragma warning restore CA1416 // Validate platform compatibility
        });
    }

    public static ErrorLog Instance
    {
        get
        {
            return _instance.Value;
        }
    }
}