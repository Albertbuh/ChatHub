using ChatHub.Models.Telegram;
using TL;

namespace ChatHub.Services.Telegram;

public class WClientTLService : ITLService
{
	readonly WTelegram.Client _client = null!;
	User _user => _client.User;

	public WClientTLService(ILogger<WClientTLService> logger, int api_id, string api_hash)
	{
		_client = new WTelegram.Client(api_id, api_hash);
		WTelegram.Helpers.Log = (lvl, msg) => logger.Log((LogLevel)lvl, msg);
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
					result.Message = $"User {_user} (id {_user.id}) is successfully logged-in";
			}
			else
				result.Message = $"User {_user} (id {_user.id}) is already logged-in";
		}
		catch (RpcException e)
		{
			result.StatusCode = e.Code;
			result.Message = e.Message;
			await this.Logout();
		}

		return result;
	}

	public async Task<TLResponse> Logout()
	{
		var logout = await _client.Auth_LogOut();
		_client.Reset(true, false);
		return new TLResponse($"User {_user} logout");
	}

	public async Task<TLResponse> GetAllMessages(long peerId)
	{
		var response = new TLResponse();
		var list = new List<string>();
		var dialogs = await _client.Messages_GetAllDialogs();
		InputPeer? peer = GetPeerFromDialogs(dialogs, peerId);
    
		if (peer != null)
		{
			for (int offset_id = 0; offset_id < 40;)
			{
				var messages = await _client.Messages_GetHistory(peer, offset_id, limit:100);
				if (messages.Messages.Length == 0)
					break;
				foreach (var msgBase in messages.Messages)
				{
					var from = messages.UserOrChat(msgBase.From ?? msgBase.Peer);
					if (msgBase is Message msg)
						list.Add($"{from}> {msg.message} {msg.media}");
					// else if (msgBase is MessageService ms)
					// 	list.Add($"{from} [{ms.action.GetType().Name[13..]}]");
				}
				offset_id = messages.Messages[^1].ID;
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
		var result = new TLResponse(StatusCodes.Status200OK, "Get dialogs");
		try
		{
			var dialogs = await _client.Messages_GetAllDialogs();
			var list = new List<Object>();
			foreach (Dialog dialog in dialogs.dialogs)
			{
				switch (dialogs.UserOrChat(dialog))
				{
					case User user when user.IsActive:
						list.Add(user);
						break;
					case ChatBase chat when chat.IsActive:
						list.Add(chat);
						break;
				}
			}
			result.Data = list;
		}
		catch (Exception e)
		{
			result = new TLResponse(StatusCodes.Status500InternalServerError, e.ToString());
		}
		return result;
	}

	public async Task<TLResponse> SendMessage(long peerId, string message)
	{
    var response = new TLResponse($"undefiend {peerId}");
    var dialogs = await _client.Messages_GetAllDialogs();
    InputPeer? peer = GetPeerFromDialogs(dialogs, peerId); 
    if(peer != null)
    {
      response.Data = await _client.SendMessageAsync(peer, message);   
      response.Message = $"Send to {peer.ToString()}";
    }
    return response;
	}
}
