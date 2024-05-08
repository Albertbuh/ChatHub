namespace ChatHub.Models.Telegram.DTO;

public struct PeerDTO
{
    public long Id { get; set; }
    public string Username { get; set; }
    public string? Tag { get; set; }
    public string PhotoUrl { get; set; }

    public PeerDTO(long id, string name, string photoUrl)
    {
        Id = id;
        Username = name;
        PhotoUrl = photoUrl;
    }
}
