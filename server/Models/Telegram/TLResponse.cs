namespace ChatHub.Models.Telegram;

public struct TLResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public Object? Data { get; set; }

    public TLResponse()
        : this(200, "") { }

    public TLResponse(string message)
        : this(200, message) { }

    public TLResponse(int statusCode, string message)
        : this(statusCode, message, null) { }

    public TLResponse(int statusCode, string message, object? data)
    {
        StatusCode = statusCode;
        Message = message;
        Data = data;
    }
}
