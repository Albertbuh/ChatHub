using PusherServer;

[Route("api")]
public class ChatController : Controller
{
    [HttpPost("messages")]
    public async Task<ActionResult> Message([FromBody] MessageDTO dto)
    {


        var options = new PusherOptions
        {
            Cluster = "eu",
            Encrypted = true
        };

        var pusher = new Pusher(
          "1768599",
          "ae5518cb781f40049fa7",
          "4ddd59dba0b6eeef2099",
          options);

        var result = await pusher.TriggerAsync(
          "chat",
          "message",
          new { username=dto.Username, message = dto.Message });

        Console.WriteLine("Received POST request to /api/messages:" + dto.Username + " - " + dto.Message);

        return Ok(new string[] {});
    }
}