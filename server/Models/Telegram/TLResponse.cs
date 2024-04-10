namespace ChatHub.Models.Telegram;

public struct TLResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public Object? Data { get; set; }

    public TLResponse()
      : this(200, "")
    { }

    public TLResponse(string message)
      : this(200, message)
    { }

    public TLResponse(int statusCode, string message)
    {
        StatusCode = statusCode;
        Message = message;
    }
}
