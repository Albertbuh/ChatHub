using ChatHub.Models.Telegram.DTO;
using server.Models.Vk.DTO;
using TL;

namespace ChatHub.Mappers.Telegram;

public class WClientMapperProfile : Profile
{
	public WClientMapperProfile()
	{
		CreateMapUserPeerDTO();
    CreateMapChatBasePeerDTO();
    CreateMapMessages();
    CreateMapDialogs();
  }

  private void CreateMapDialogs()
  {
    CreateMap<User, DialogDTO>()
      .ForMember(dest => dest.Id, opt => opt.MapFrom(d => d.ID))
      .ForMember(dest => dest.Title, opt => opt.MapFrom(d => $"{d.first_name} {d.last_name}".Trim()))
      .ForMember(dest => dest.PhotoId, opt => opt.MapFrom(d => GetUserPhotoId(d)));

    CreateMap<ChatBase, DialogDTO>()
      .ForMember(dest => dest.Id, opt => opt.MapFrom(d => d.ID))
      .ForMember(dest => dest.PhotoId, opt => opt.MapFrom(d => GetChatPhotoId(d)));
  }

  private void CreateMapMessages()
  {
    CreateMap<Message, MessageDTO>()
      .ForMember(dest => dest.Id, opt => opt.MapFrom(m => m.ID))
      .ForMember(dest => dest.Message, opt => opt.MapFrom(m => $"{m.message} {m.media}"));

    CreateMap<MessageService, MessageDTO>()
      .ForMember(dest => dest.Id, opt => opt.MapFrom(ms => ms.ID))
      .ForMember(dest => dest.Message, opt => opt.MapFrom(ms => GetMessageServiceMessage(ms)));
  }

  private string GetMessageServiceMessage(MessageService ms) => ms.action.GetType().Name[13..];

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
