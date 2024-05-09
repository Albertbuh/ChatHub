namespace ChatHub.Models.Vk.DTO;

public struct VkDialogDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string MainUsername { get; set; }
    public string PhotoUrl { get; set; }
    public VkMessageDTO TopMessage { get; set; }

    public VkDialogDTO(long id, string title, string tag, string photoUrl = "", VkMessageDTO? topMessage = null)
    {
        Id = id;
        Title = title;
        PhotoUrl = photoUrl;
        MainUsername = tag;
        TopMessage = topMessage ?? new VkMessageDTO();
    }
}
