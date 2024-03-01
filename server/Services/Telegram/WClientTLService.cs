using ChatHub.Models.Telegram;
using ChatHub.Models.Telegram.DTO;
using TL;

namespace ChatHub.Services.Telegram;

public class WClientTLService : ITLService
{
	readonly WTelegram.Client _client = null!;
	readonly ILogger<WClientTLService> _logger;
	User _user => _client.User;
	Messages_Dialogs? _dialogs;

    bool IsLoggedIn => _client.User != null;
	public WClientTLService(ILogger<WClientTLService> logger, int api_id, string api_hash)
	{
		_client = new WTelegram.Client(api_id, api_hash);
		WTelegram.Helpers.Log = (lvl, msg) => logger.Log((LogLevel)lvl, msg);

		_logger = logger;
		var phone = Environment.GetEnvironmentVariable("TELEGRAM_API_PHONE");
		if(!String.IsNullOrEmpty(phone))
			Task.WaitAll(Task.Run(async () => await Login(phone)));
    }

    public async Task<TLResponse> Login(string loginInfo)
	{
		string GetResponseMessage(string info) =>
			info switch
			{
				"verification_code" => "Send verification code",
				"name" => "Sign up is required (first/last name)",
				"password" => "Enter your password",
				_ => $"Pending case {info}"
			};
		var result = new TLResponse();

		try
		{
			if (_user == null)
			{
				result.Message = GetResponseMessage(await _client.Login(loginInfo));

				if (_user != null)
				{
                    result.Message = $"User {_user} (id {_user.id}) is successfully logged-in";
					_dialogs = await _client.Messages_GetAllDialogs();
                }
			}
			else
				result.Message = $"User {_user} (id {_user.id}) is already logged-in";
		}
		catch (RpcException e)
		{
			result.StatusCode = e.Code;
			result.Message = e.Message;
			await Logout();
		}

		return result;
	}

	public async Task<TLResponse> Logout()
	{
		var logout = await _client.Auth_LogOut();
		_client.Reset(true, false);
		return new TLResponse($"User {_user} logout");
	}

	
	public async Task<TLResponse> GetMessages(long peerId, int offsetId, int limit)
	{
		if (!IsLoggedIn)
			return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");
		if (_dialogs == null)
			_dialogs = await _client.Messages_GetAllDialogs();

		var response = new TLResponse();
		var list = new List<string>();
		InputPeer? peer = GetPeerFromDialogs(_dialogs, peerId);
    
		if (peer != null)
		{
			var messages = await _client.Messages_GetHistory(peer, offset_id:offsetId, limit:limit);
			foreach (var msgBase in messages.Messages)
			{
				var from = messages.UserOrChat(msgBase.From ?? msgBase.Peer);
				if (msgBase is Message msg)
					list.Add($"{from}> {msg.message} {msg.media}");
				else if (msgBase is MessageService ms)
					list.Add($"{from} [{ms.action.GetType().Name[13..]}]");
			}
			response.Data = list;
		}

		return response;
	}

	private InputPeer? GetPeerFromDialogs(Messages_Dialogs dialogs, long peerId)
	{
		if(dialogs.users.ContainsKey(peerId))
			return dialogs.users[peerId];
		else if(dialogs.chats.ContainsKey(peerId))
			return dialogs.chats[peerId];
		else 
			return null;
	}

	public async Task<TLResponse> GetAllDialogs()
	{
        if (!IsLoggedIn)
            return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");
		if (_dialogs == null)
			_dialogs = await _client.Messages_GetAllDialogs();

        var result = new TLResponse(StatusCodes.Status200OK, "Get dialogs");
		try
		{
			var list = new List<DialogDTO>();
			foreach (Dialog dialog in _dialogs.dialogs)
			{
				var messages = await _client.Messages_GetHistory(
					GetPeerFromDialogs(_dialogs, dialog.peer.ID), 
					offset_id: 0, 
					limit: 1);
				var lastMessage = messages.Messages.First();
                var from = messages.UserOrChat(lastMessage.From);
                DialogDTO dto = new DialogDTO();

				switch (_dialogs.UserOrChat(dialog))
				{
					case User user when user.IsActive:
						dto = GetUserInfo(user);
						break;
					case ChatBase chat when chat.IsActive:
						dto = GetChatMainInfo(chat);
						break;
				}

                if (lastMessage is Message msg)
                    dto.Message = ($"{from}> {msg.message} {msg.media}");
                else if (lastMessage is MessageService ms)
                    dto.Message = ($"{from} [{ms.action.GetType().Name[13..]}]");

                list.Add(dto);
			}

			result.Data = list;
		}
		catch (Exception e)
		{
			result = new TLResponse(StatusCodes.Status500InternalServerError, e.ToString());
		}
		return result;
	}

	private DialogDTO GetUserInfo(User user)
	{
        long photoId = 0;
        if (user.photo is UserProfilePhoto photo)
            photoId = photo.photo_id;
		string title = $"{user.first_name} {user.last_name}";
		title = title.Trim();
        return new DialogDTO(user.id, title, user.MainUsername, photoId);
    }
	private DialogDTO GetChatMainInfo(ChatBase chat)
	{
        long photoId = 0;
        if (chat.Photo is ChatPhoto photo)
            photoId = photo.photo_id;
		return new DialogDTO(chat.ID, chat.Title, chat.MainUsername,photoId);
    }

	public async Task<TLResponse> SendMessage(long peerId, string message)
	{
        if (!IsLoggedIn)
            return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");

        var response = new TLResponse($"undefiend {peerId}");
		var dialogs = await _client.Messages_GetAllDialogs();
		InputPeer? peer = GetPeerFromDialogs(dialogs, peerId); 
		if(peer != null)
		{
		  response.Data = await _client.SendMessageAsync(peer, message);   
		  response.Message = $"Send to {peer}";
		}
		return response;
	}
}
