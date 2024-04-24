using server.Models.Vk.DTO;

namespace ChatHub.Models.Vk.DTO;

public struct VkMessageDTO
{
    public long? Id { get; set; }
    public string Message { get; set; }
    public DateTime? Date { get; set; }

    public VkMediaDTO? Media { get; set; }
    public VkPeerDTO? Sender { get; set; }

    public VkMessageDTO(long id, string message, DateTime date, VkMediaDTO media, VkPeerDTO? sender)
      : this(id, message, date)
    {
        Sender = sender;
        Media = media;
    }

    public VkMessageDTO(long id, string message, DateTime date)
    {
        Id = id;
        Message = message;
        Date = date;
    }
}
