using ChatHub.Models.Telegram;
using ChatHub.Models.Telegram.DTO;
using TL;

namespace ChatHub.Services.Telegram;

public class WClientTLService : ITLService
{
	readonly WTelegram.Client _client = null!;
	User _user => _client.User;
	Messages_Dialogs? _dialogs;

	bool IsLoggedIn => _client.User != null;

	readonly ILogger<WClientTLService> _logger;
	readonly IMapper _mapper;

	public WClientTLService(
		ILogger<WClientTLService> logger,
		IMapper mapper,
		int api_id,
		string api_hash
	)
	{
		_client = new WTelegram.Client(api_id, api_hash);
		WTelegram.Helpers.Log = (lvl, msg) => logger.Log((LogLevel)lvl, msg);

		_logger = logger;
		_mapper = mapper;

		var phone = Environment.GetEnvironmentVariable("TELEGRAM_API_PHONE");
		if (!String.IsNullOrEmpty(phone))
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

	public async Task<TLResponse> GetMessages(long peerId, int offset, int limit)
	{
		if (!IsLoggedIn)
			return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");
		if (_dialogs == null)
			_dialogs = await _client.Messages_GetAllDialogs();

		var response = new TLResponse();
		var peer = GetPeerFromDialogs(_dialogs, peerId);

		if (peer != null)
		{
			if (peer is InputPeer inputPeer)
				response.Data = await GetMessagesFromPeer(inputPeer, offset, limit);
			else if (peer is ChatBase channel)
				response.Data = await GetMessagesFromPeer(channel, offset, limit);
			else
				_logger.LogWarning($"Unsupported peer type: {peer.GetType().Name}");
		}
		return response;
	}

	private async Task<List<MessageDTO>> GetMessagesFromPeer(InputPeer peer, int offset, int limit)
	{
		var result = new List<MessageDTO>();
		var messages = await _client.Messages_GetHistory(peer, add_offset: offset, limit: limit);
		// _logger.LogInformation($"Read history of user {peer.ID} (length: {messages.Messages.Length}; limit: {limit})");
		foreach (var msgBase in messages.Messages)
		{
			result.Add(CreateMessageDTO(msgBase));
		}
		return result;
	}

	private IPeerInfo? GetPeerFromMessage(Messages_MessagesBase collection, MessageBase message)
	{
		return collection.UserOrChat(message.From ?? message.Peer);
	}

	private IPeerInfo? GetPeerFromDialogs(Messages_Dialogs dialogs, long peerId)
	{
		if (dialogs.users.ContainsKey(peerId))
			return dialogs.users[peerId];
		else if (dialogs.chats.ContainsKey(peerId))
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
		var list = new List<DialogDTO>();
		foreach (Dialog dialog in _dialogs.dialogs)
		{
			list.Add(await CreateDialogDTO(dialog));
		}

		result.Data = list;
		return result;
	}

	private PeerDTO CreatePeerDTO(IPeerInfo? peer) =>
		peer switch
		{
			User u => _mapper.Map<PeerDTO>(u),
			ChatBase cb => _mapper.Map<PeerDTO>(cb),
			_ => throw new InvalidCastException("Cant find peer class")
		};

	private long GetPhotoIdByPeer(IPeerInfo info)
	{
		long id = 0;
		switch (info)
		{
			case User u:
				if (u.photo is UserProfilePhoto userPhoto)
					id = userPhoto.photo_id;
				break;
			case ChatBase chat:
				if (chat.Photo is ChatPhoto chatPhoto)
					id = chatPhoto.photo_id;
				break;
		}
		return id;
	}

	private MessageDTO CreateMessageDTO(MessageBase message)
	{
		var result = new MessageDTO();
		switch (message)
		{
			case Message m:
				result = _mapper.Map<MessageDTO>(m);
				break;
			case MessageService ms:
				result = _mapper.Map<MessageDTO>(ms);
				break;
			default:
				throw new InvalidCastException("Cant find message class");
		}
		;
		result.Sender = CreatePeerDTO(_dialogs!.UserOrChat(message?.From ?? message?.Peer));
		return result;
	}

	private async Task<DialogDTO> CreateDialogDTO(Dialog dialog)
	{
		if (_dialogs == null)
			_dialogs = await _client.Messages_GetAllDialogs();

		DialogDTO result = new();
		switch (_dialogs.UserOrChat(dialog))
		{
			case User user when user.IsActive:
				result = _mapper.Map<DialogDTO>(user);
				break;
			case ChatBase chat when chat.IsActive:
				result = _mapper.Map<DialogDTO>(chat);
				break;
		}
		var topMessage = _dialogs
			.Messages
			.First(m => m.Peer.ID == dialog.peer.ID && m.ID == dialog.TopMessage);
		result.TopMessage = CreateMessageDTO(topMessage);

		return result;
	}

	public async Task<TLResponse> SendMessage(long peerId, string message)
	{
		if (!IsLoggedIn)
			return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");
		if (_dialogs == null)
			_dialogs = await _client.Messages_GetAllDialogs();
    
		var response = new TLResponse($"undefiend {peerId}");
		IPeerInfo? peer = GetPeerFromDialogs(_dialogs, peerId);
		if (peer != null)
		{
			switch (peer)
			{
				case User u:
					response.Data = CreateMessageDTO(await _client.SendMessageAsync(u, message));
          response.Message = $"Send to {u.MainUsername}";
					break;
				case ChatBase cb:
					response.Data = CreateMessageDTO(await _client.SendMessageAsync(cb, message));
          response.Message = $"Send to {cb.MainUsername}";
					break;
			}
		}
		return response;
	}
}
