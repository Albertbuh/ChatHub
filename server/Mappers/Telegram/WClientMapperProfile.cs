using ChatHub.Models.Telegram.DTO;
using TL;

namespace ChatHub.Mappers.Telegram;

public class WClientMapperProfile : Profile
{
	public WClientMapperProfile()
	{
		CreateMapUserPeerDTO();
    CreateMapChatBasePeerDTO();
  }

  private void CreateMapDialog()
  {
    
  }

  private void CreateMapChatBasePeerDTO()
  {
    CreateMap<ChatBase, PeerDTO>()
			.ForMember(dest => dest.Id, opt => opt.MapFrom(chat => chat.ID))
			.ForMember(dest => dest.Username, opt => opt.MapFrom(chat => chat.MainUsername))
			.ForMember(dest => dest.PhotoId, opt => opt.MapFrom(chat => GetChatPhotoId(chat)));
  }

	private void CreateMapUserPeerDTO()
	{
		CreateMap<User, PeerDTO>()
			.ForMember(dest => dest.Id, opt => opt.MapFrom(user => user.ID))
			.ForMember(
				dest => dest.Username,
				opt => opt.MapFrom(user => $"{user.first_name} {user.last_name}".Trim())
			)
			.ForMember(dest => dest.PhotoId, opt => opt.MapFrom(user => GetUserPhotoId(user)));
	}

	private long GetUserPhotoId(User u) => (u.photo is UserProfilePhoto photo) ? photo.photo_id : 0;

	private long GetChatPhotoId(ChatBase c) => (c.Photo is ChatPhoto photo) ? photo.photo_id : 0;
}
