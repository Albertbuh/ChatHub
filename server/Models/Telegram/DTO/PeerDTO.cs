namespace ChatHub.Models.Telegram.DTO;

public struct PeerDTO
{
  public readonly long Id {get;}
  public readonly string Username {get;}
  public readonly long PhotoId {get;}

  public PeerDTO(long id, string name, long photoId)
  {
    Id = id;
    Username = name;
    PhotoId = photoId;
  }
}
