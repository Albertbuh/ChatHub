namespace ChatHub.Models.Telegram.DTO;

public struct MessageDTO
{
  public long Id { get; set;  }
  public string Message { get; set; }
  public DateTime Date { get; set; }
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
