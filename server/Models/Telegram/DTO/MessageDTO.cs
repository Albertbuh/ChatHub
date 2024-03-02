namespace ChatHub.Models.Telegram.DTO;

public struct MessageDTO
{
  public readonly long Id { get; }
  public readonly string Message { get; }
  public readonly DateTime Date { get; }
  public PeerDTO? Sender { get; set; }

  public MessageDTO(long id, string message, DateTime date, PeerDTO? sender)
    : this(id, message, date)
  {
    Sender = sender;
  }
  
  public MessageDTO(long id, string message, DateTime date)
  {
    Id = id;
    Message = message;
    Date = date;
  }
}
