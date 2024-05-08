using ChatHub.Utils.Hub;
using ChatHub.Models.Telegram;
using ChatHub.Models.Telegram.DTO;
using Microsoft.AspNetCore.SignalR;
using TL;

namespace ChatHub.Services.Telegram;

public class WClientTLService : ITLService
{
    readonly WTelegram.Client _client = null!;
    readonly WTelegram.UpdateManager _manager = null!;

    long lastDialogId = 0;
    User _user => _client.User;
    Messages_Dialogs? _dialogs;

    readonly IHubContext<ChatHubR> _chatHub;

    private IPeerInfo? User(long id) => _manager.Users.ContainsKey(id) ? _manager.Users[id] : null;

    private IPeerInfo? Chat(long id) => _manager.Users.ContainsKey(id) ? _manager.Chats[id] : null;

    private IPeerInfo Peer(Peer? peer) => _manager.UserOrChat(peer);

    bool IsLoggedIn => _client.User != null;
    string mainImageDirectory =>
        IsLoggedIn
            ? @$"../client/public/assets/telegram/userAssets/{_client.User.MainUsername}"
            : @"./images/";

    readonly ILogger<WClientTLService> _logger;
    readonly IMapper _mapper;

    public WClientTLService(
        ILogger<WClientTLService> logger,
        IMapper mapper,
        IHubContext<ChatHubR> chatHub,
        int api_id,
        string api_hash
    )
    {
        _client = new WTelegram.Client(api_id, api_hash);
        _manager = _client.WithUpdateManager(OnUpdate);
        WTelegram.Helpers.Log = (lvl, msg) => logger.Log((LogLevel)lvl, msg);
        _chatHub = chatHub;
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
                    ThreadPool.QueueUserWorkItem(async (object? state) => await LoadProfilePicture(_user));
                    result.Message = $"User {_user} (id {_user.id}) is successfully logged-in";
                    result.Data = _mapper.Map<PeerDTO>(_user);
                    await UpdateDialogs();
                }
            }
            else
            {
                result.Message = $"User {_user} (id {_user.id}) is already logged-in";
                result.Data = _mapper.Map<PeerDTO>(_user);
            }
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
            _dialogs = await UpdateDialogs();

        var response = new TLResponse(400, $"Undefiend user {peerId}");
        var peer = GetPeerById(peerId);

        if (peer != null)
        {
            if (peer is User user)
                response.Data = await GetMessagesFromPeer(user, offset, limit);
            else if (peer is ChatBase channel)
                response.Data = await GetMessagesFromPeer(channel, offset, limit);
            else
                _logger.LogWarning($"Unsupported peer type: {peer.GetType().Name}");
            response.Message = $"Get messages from dialog {peerId}";
            response.StatusCode = StatusCodes.Status200OK;
        }
        return response;
    }

    private async Task<List<MessageDTO>> GetMessagesFromPeer(InputPeer peer, int offset, int limit)
    {
        var result = new List<MessageDTO>();
        var messages = await _client.Messages_GetHistory(peer, add_offset: offset, limit: limit);
        messages.CollectUsersChats(_manager.Users, _manager.Chats);
        foreach (var msgBase in messages.Messages)
        {
            result.Add(CreateMessageDTO(msgBase));
            ThreadPool.QueueUserWorkItem(
                async (object? state) =>
                {
                    if (msgBase is Message m)
                        await LoadProfilePicture(Peer(m.From ?? m.Peer));
                }
            );
            ThreadPool.QueueUserWorkItem(
                async (object? state) =>
                {
                    if (msgBase is Message m && m.media != null)
                        await LoadMessageMedia(m, peer);
                }
            );
        }
        return result;
    }

    private async Task LoadMessageMedia(Message message, InputPeer peer)
    {
        if (message.media is null)
            return;

        try
        {
            string profilePictureDirectoryPath = Path.Combine(mainImageDirectory, peer.ID.ToString());
            if (!Directory.Exists(profilePictureDirectoryPath))
            {
                lock (new object())
                    Directory.CreateDirectory(profilePictureDirectoryPath);
            }

            string filename = $"{message.ID}";
            if (!IsFileExists(profilePictureDirectoryPath, filename))
            {
                if (message.media is MessageMediaDocument { document: Document document })
                {
                    filename = $"{filename}.{document.mime_type[(document.mime_type.IndexOf('/') + 1)..]}";
                    var filepath = Path.Combine(profilePictureDirectoryPath, filename);
                    using var fileStream = File.Create(filepath);
                    await _client.DownloadFileAsync(document, fileStream);
                }
                else if (message.media is MessageMediaPhoto { photo: Photo photo })
                {
                    filename = $"{message.ID}.jpeg";
                    var filepath = Path.Combine(profilePictureDirectoryPath, filename);
                    using var fileStream = File.Create(filepath);
                    var type = await _client.DownloadFileAsync(photo, fileStream);
                    fileStream.Close();

                    if (type != 0u && type is not Storage_FileType.unknown and not Storage_FileType.partial)
                        File.Move(
                            filepath,
                            $"{Path.Combine(profilePictureDirectoryPath, Path.GetFileNameWithoutExtension(filename))}.{type}",
                            true
                        );
                }
                _logger.LogInformation($"Media for {message.ID} has been loaded");
            }
        }
        catch { }
    }

    private IPeerInfo? GetPeerById(long peerId)
    {
        if (_dialogs!.users.ContainsKey(peerId))
            return _dialogs.users[peerId];
        else if (_dialogs.chats.ContainsKey(peerId))
            return _dialogs.chats[peerId];
        else
            return null;
    }

    public async Task<TLResponse> GetAllDialogs()
    {
        if (!IsLoggedIn)
            return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");
        if (_dialogs == null)
            _dialogs = await UpdateDialogs();

        var result = new TLResponse(StatusCodes.Status200OK, "Get dialogs");
        var list = new List<DialogDTO>();
        foreach (Dialog dialog in _dialogs.dialogs)
        {
            var dto = await CreateDialogDTO(dialog);
            if (dto.Id > 0)
                list.Add(dto);
        }
        lastDialogId = list[0].Id;
        result.Data = list;
        return result;
    }

    private PeerDTO? CreatePeerDTO(IPeerInfo? peer) =>
        peer switch
        {
            User u => _mapper.Map<PeerDTO>(u),
            ChatBase cb => _mapper.Map<PeerDTO>(cb),
            _
                => throw new InvalidCastException(
                    $"Cant find peer type: {GetStringRepresentationOfPeerType(peer)}"
                )
        };

    private string GetStringRepresentationOfPeerType(IPeerInfo? peer) =>
        peer is not null ? peer.GetType().ToString() : "null";

    private bool IsFileExists(string directory, string filename)
    {
        var files = Directory.GetFiles(directory, filename + ".*");
        return files.Length > 0;
    }

    private async Task LoadProfilePicture(IPeerInfo peer)
    {
        try
        {
            string profilePictureDirectoryPath = Path.Combine(mainImageDirectory, peer.ID.ToString());
            if (!Directory.Exists(profilePictureDirectoryPath))
            {
                lock (new object())
                    Directory.CreateDirectory(profilePictureDirectoryPath);
            }
            const string filename = "profile.jpeg";
            const string filenameWithoutExtension = "profile";
            if (!IsFileExists(profilePictureDirectoryPath, filenameWithoutExtension))
            {
                var filepath = Path.Combine(profilePictureDirectoryPath, filename);
                using var fileStream = File.Create(filepath);
                var type = await _client.DownloadProfilePhotoAsync(peer, fileStream);
                fileStream.Close();

                if (type != 0u && type is not Storage_FileType.unknown and not Storage_FileType.partial)
                {
                    File.Move(
                        filepath,
                        $"{Path.Combine(profilePictureDirectoryPath, filenameWithoutExtension)}.{type}",
                        true
                    );
                }
            }
        }
        catch { }
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
                throw new InvalidCastException($"Cant find message type: {message.GetType()}");
        }
        result.Sender = CreatePeerDTO(Peer(message?.From ?? message?.Peer));
        return result;
    }

    private async Task<DialogDTO> CreateDialogDTO(Dialog dialog)
    {
        if (_dialogs == null)
            _dialogs = await UpdateDialogs();

        DialogDTO result = new();
        switch (Peer(dialog.Peer))
        {
            case User user when user.IsActive:
                result = _mapper.Map<DialogDTO>(user);
                break;
            case ChatBase chat when chat.IsActive:
                result = _mapper.Map<DialogDTO>(chat);
                break;
        }
        if (result.Id > 0)
        {
            ThreadPool.QueueUserWorkItem(
                async (object? state) => await LoadProfilePicture((Peer(dialog.Peer)))
            );
            var topMessage = _dialogs
                .Messages
                .First(m => m.Peer.ID == dialog.peer.ID && m.ID == dialog.TopMessage);
            result.TopMessage = CreateMessageDTO(topMessage);
        }

        return result;
    }

    public async Task<TLResponse> SendMessage(long peerId, string? message, string? mediaFilepath)
    {
        if (!IsLoggedIn)
            return new TLResponse(StatusCodes.Status401Unauthorized, "Undefiend user");
        if (_dialogs == null)
            _dialogs = await UpdateDialogs();
        if (String.IsNullOrEmpty(message) && String.IsNullOrEmpty(mediaFilepath))
            return new(StatusCodes.Status400BadRequest, "Nothing to send");

        MessageDTO? createdMessage = !String.IsNullOrEmpty(mediaFilepath)
            ? await SendMessageWithMedia(peerId, message, mediaFilepath)
            : await SendMessage(peerId, message!);

        return createdMessage != null
            ? new(StatusCodes.Status201Created, $"Send message to {peerId}", createdMessage)
            : new(StatusCodes.Status400BadRequest, "Nothing to send");
    }

    private async Task<MessageDTO?> SendMessageWithMedia(
        long peerId,
        string? caption,
        string mediaFilepath
    )
    {
        var peer = GetPeerById(peerId)?.ToInputPeer();
        if (peer != null)
        {
            var inputFile = await _client.UploadFileAsync(mediaFilepath);
            return CreateMessageDTO(await _client.SendMediaAsync(peer, caption, inputFile));
        }
        return null;
    }

    private async Task<MessageDTO?> SendMessage(long peerId, string message)
    {
        var peer = GetPeerById(peerId)?.ToInputPeer();
        MessageDTO? result =
            peer != null ? CreateMessageDTO(await _client.SendMessageAsync(peer, message)) : null;
        if (result != null)
        {
            await UpdateDialogs();
            await SendUpdatedDialogs();
        }
        return result;
    }

    private async Task OnUpdate(Update update)
    {
        bool isUpdated = true;
        switch (update)
        {
            case UpdateNewMessage unm:
                _logger.LogInformation("Update new message");
                break;
            case UpdateEditMessage uem:
                _logger.LogInformation("Update edit message");
                break;
            case UpdateDeleteChannelMessages udcm:
                _logger.LogInformation("Update delete channel message");
                break;
            case UpdateDeleteMessages udm:
                _logger.LogInformation("Update delete message");
                break;
            default:
                isUpdated = false;
                break;
        }
        if (isUpdated)
        {
            await SendUpdatedMessages();
            await UpdateDialogs();
            await SendUpdatedDialogs();
        }
    }

    private async Task SendUpdatedMessages()
    {
        var messages = await GetMessages(lastDialogId, 0, 50);
        await ChatHubR.UpdateMessages(
            _chatHub,
            new HubEntity { Id = lastDialogId, Data = messages.Data }
        );
        _logger.Log(LogLevel.Information, "Updated messages were sended");
    }

    private async Task SendUpdatedDialogs()
    {
        var dialogs = await GetAllDialogs();
        await ChatHubR.UpdateDialogs(
            _chatHub,
            new HubEntity { Id = _user.id, Data = dialogs.Data }
        );
        _logger.Log(LogLevel.Information, "Updated dialogs were sended");
    }

    private async Task<TL.Messages_Dialogs> UpdateDialogs()
    {
        _dialogs = await _client.Messages_GetAllDialogs();
        _dialogs.CollectUsersChats(_manager.Users, _manager.Chats);
        return _dialogs;
    }
}
