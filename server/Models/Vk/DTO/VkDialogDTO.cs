namespace ChatHub.Models.Vk.DTO;

public struct VkDialogDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string MainUsername { get; set; }
    public string PhotoUri { get; set; }
    public VkMessageDTO TopMessage { get; set; }

    public VkDialogDTO(long id, string title, string tag, string photoUri = "", VkMessageDTO? topMessage = null)
    {
        Id = id;
        Title = title;
        PhotoUri = photoUri;
        MainUsername = tag;
        TopMessage = topMessage ?? new VkMessageDTO();
    }
}
