namespace server.Models.Vk.DTO;

public struct VkPeerDTO
{
    public long Id { get; set; }
    public string? Username { get; set; }
    public string? PhotoUrl { get; set; }

    public VkPeerDTO(long id, string name, string photoUrl)
    {
        Id = id;
        Username = name;
        PhotoUrl = photoUrl;
    }
}
