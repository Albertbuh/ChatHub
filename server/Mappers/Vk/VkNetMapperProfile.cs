using ChatHub.Models.Vk.DTO;
using VkNet.Model;
namespace ChatHub.Mappers.Vk;

public class VkNetMapperProfile : Profile
{
    public VkNetMapperProfile()
    {
        CreateMapUserVkPeerDTO();
    }


    private void CreateMapUserVkPeerDTO()
    {
        CreateMap<UserDTO, VkPeerDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(u => u.ScreenName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(u => u.PhotoUri));
    }

    private void CreateMapMessageDTO()
    {
        CreateMap<Message, VkMessageDTO>()
            .ForMember(dest => dest.Message, opt => opt.MapFrom(m => m.Text));
    }

}
