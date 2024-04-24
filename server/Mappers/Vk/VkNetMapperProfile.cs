using ChatHub.Models.Vk.DTO;
using VkNet.Model;
namespace ChatHub.Mappers.Vk;

public class VkNetMapperProfile : Profile
{
    public VkNetMapperProfile()
    {
        CreateMapUserVkPeerDTO();
        CreateMapMessageDTO();
        CreateMapUserUserDTO();
        CreateMapGroupUserDTO();
        CreateMapVkUserVkPeerDTO();
    }


    private void CreateMapUserVkPeerDTO()
    {
        CreateMap<UserDTO, VkPeerDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(u => u.ScreenName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(u => u.PhotoUri));
    }

    private void CreateMapVkUserVkPeerDTO()
    {
        CreateMap<User, VkPeerDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(u => u.FirstName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(u => u.Photo100.AbsoluteUri));
    }

    private void CreateMapUserUserDTO()
    {
        CreateMap<User, UserDTO>()
            .ForMember(dest => dest.ScreenName, opt => opt.MapFrom(u => u.FirstName))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(u => u.Id))
            .ForMember(dest => dest.PhotoUri, opt => opt.MapFrom(u=>u.Photo100.AbsoluteUri));
    }

    private void CreateMapGroupUserDTO()
    {
        CreateMap<Group, UserDTO>()
            .ForMember(dest => dest.ScreenName, opt => opt.MapFrom(u => u.Name))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(u => u.Id))
            .ForMember(dest => dest.PhotoUri, opt => opt.MapFrom(u => u.Photo100.AbsoluteUri));
    }

    private void CreateMapMessageDTO()
    {
        CreateMap<Message, VkMessageDTO>()
            .ForMember(dest => dest.Message, opt => opt.MapFrom(m => m.Text))
            .ForMember(dest=> dest.Date, opt => opt.MapFrom(m=> m.Date))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(m=>m.Id));
    }

}
