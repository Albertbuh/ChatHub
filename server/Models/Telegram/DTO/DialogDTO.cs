namespace ChatHub.Models.Telegram.DTO;

public struct DialogDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string MainUsername { get; set; }
    public string PhotoUrl { get; set; }
    public MessageDTO TopMessage { get; set; }

    public DialogDTO(long id, string title, string tag, string photoUrl = "0", MessageDTO? topMessage = null)
    {
        Id = id;
        Title = title;
        PhotoUrl = photoUrl;
        MainUsername = tag;
        TopMessage = topMessage ?? new MessageDTO();
    }
}
