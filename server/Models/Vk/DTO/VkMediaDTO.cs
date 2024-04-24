namespace server.Models.Vk.DTO
{
    public class VkMediaDTO
    {
        public string? Type { get; set; }
        public string? MediaUrl { get; set; }

        public VkMediaDTO(string type, string mediaUrl) 
        {
            Type = type;    
            MediaUrl = mediaUrl;   
        }
    }
}
