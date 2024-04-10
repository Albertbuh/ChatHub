namespace server.Models.Vk
{
    public class VKResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public Object? Data { get; set; }

        public VKResponse()
          : this(200, "")
        { }

        public VKResponse(string message)
          : this(200, message)
        { }

        public VKResponse(int statusCode, string message)
        {
            StatusCode = statusCode;
            Message = message;
        }

    }
}
