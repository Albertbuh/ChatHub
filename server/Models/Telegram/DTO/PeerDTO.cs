namespace ChatHub.Models.Telegram.DTO;

public struct PeerDTO
{
  public long Id { get; set; }
  public string Username { get; set; }
  public long PhotoId { get; set; }

  public PeerDTO(long id, string name, long photoId)
  {
    Id = id;
    Username = name;
    PhotoId = photoId;
  }
}
