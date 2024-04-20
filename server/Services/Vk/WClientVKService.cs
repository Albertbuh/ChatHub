using ChatHub.Services.Telegram;
using server.Models.Vk;
using server.Models.Vk.DTO;
using System.Net.Http.Headers;
using System.Text;
using VkNet;
using VkNet.AudioBypassService.Extensions;
using VkNet.Enums.Filters;
using VkNet.Enums.StringEnums;
using VkNet.Model;

namespace server.Services.Vk
{
    public class WClientVKService : IVKService
    {
        private readonly VkApi? api;
        readonly ILogger<WClientTLService> _logger;
        readonly IMapper _mapper;
        GetConversationsResult _conversation = null!;
        private List<User> Users = null!;
        private List<Group> Groups = null!;

        private ulong? pts;
        private ulong ts;
        ulong _applicationId;
        public WClientVKService(
            ILogger<WClientTLService> logger,
            IMapper mapper,
            ulong appId)
        {
            _logger = logger;
            _mapper = mapper;
            var services = new ServiceCollection();
            services.AddAudioBypass();
            _applicationId = appId;
            api = new VkApi(services);

        }

        public async Task<VKResponse> GetDialogs(ulong offsetId, ulong limit)
        {
            if (!api.IsAuthorized)
                return new VKResponse(StatusCodes.Status401Unauthorized, "Undefined user");


            if (_conversation == null)
            {
                _conversation = await api.Messages.GetConversationsAsync(new GetConversationsParams()
                {
                    Count = limit,
                    Offset = offsetId
                });
                var userIds = _conversation.Items
                    .Where(chat => chat.Conversation.Peer.Type == ConversationPeerType.User)
                    .Select(chat => chat.Conversation.Peer.Id)
                    .ToList();

                var groupIds = _conversation.Items
                    .Where(chat => chat.Conversation.Peer.Type == ConversationPeerType.Group)
                    .Select(chat => Math.Abs(chat.Conversation.Peer.Id).ToString())
                    .ToList();
                Users = (await api!.Users.GetAsync(userIds, ProfileFields.All)).ToList();
                Groups = (await api.Groups.GetByIdAsync(groupIds, null, GroupsFields.All)).ToList();


            }

            var result = new VKResponse(StatusCodes.Status200OK, "Get dialogs");
            var list = new List<VkDialogDTO>();
            foreach (var conversation in _conversation.Items)
            {
                list.Add(CreateConversationDTO(conversation));
            }

            result.Data = list;
            return result;

        }

        private VkDialogDTO CreateConversationDTO(ConversationAndLastMessage conversation)
        {


            var id = conversation.Conversation.Peer.Id;
            string name = "Undefined";
            VkDialogDTO dialogDto = new();
            UserDTO user = new UserDTO();
            switch (conversation.Conversation.Peer.Type)
            {
                case ConversationPeerType.User:
                    var participant = Users.FirstOrDefault(u => u.Id == id);
                    dialogDto.MainUsername = participant?.ScreenName ?? " ";

                    if (participant != null)
                    {
                        name = $"{participant.FirstName} {participant.LastName}";
                    }
                    dialogDto.PhotoUri = participant?.Photo100?.AbsoluteUri ?? "";
                    break;
                case ConversationPeerType.Chat:
                    name = conversation.Conversation.ChatSettings.Title;
                    dialogDto.PhotoUri = conversation.Conversation.ChatSettings.Photo?.Photo100.ToString() ?? "";

                    break;
                case ConversationPeerType.Group:
                    var group = Groups.FirstOrDefault(f => f.Id == Math.Abs(id));
                    dialogDto.PhotoUri = group?.Photo100.AbsoluteUri.ToString() ?? " ";
                    dialogDto.MainUsername = group?.ScreenName ?? " ";
                    name = group?.Name ?? "";
                    break;
            }

            user.Id = id;
            user.PhotoUri = dialogDto.PhotoUri;
            user.ScreenName = dialogDto.MainUsername;
            dialogDto.Title = name;
            dialogDto.Id = id;
            dialogDto.TopMessage = CreateMessageDto(conversation.LastMessage, user);

            return dialogDto;
        }

        private VkMessageDTO CreateMessageDto(Message message, UserDTO user)
        {
            VkMessageDTO messageDTO = new();
            messageDTO.Message = message.Text;
            messageDTO.Date = message.Date;
            messageDTO.Id = message.Id;
            messageDTO.Sender = CreatePeerDto(user);

            return messageDTO;
        }

        private VkPeerDTO? CreatePeerDto(UserDTO user)
        {
            VkPeerDTO peerDTO = new();
            peerDTO.Id = user.Id;
            peerDTO.Username = user.ScreenName;
            peerDTO.PhotoUrl = user.PhotoUri;

            return peerDTO;
        }

        public async Task<VKResponse> GetMessages(long chatId, int offsetId, int limit)
        {
            if (!api.IsAuthorized)
                return new VKResponse(StatusCodes.Status401Unauthorized, "Undefined user");

            var messages = await api.Messages.GetHistoryAsync(new MessagesGetHistoryParams()
            {
                Count = limit,
                Offset = offsetId,
                PeerId = chatId
            });

            var messageList = new List<VkMessageDTO>(limit);
            var result = new VKResponse();
            var chat = api.Messages.GetConversationMembers(chatId);
            var chatUsers = chat.Profiles?.ToList();

            var chatGroups = chat.Groups?.ToList();

            foreach (var message in messages.Messages)
            {
                var userVk = chatUsers?.FirstOrDefault(x => x.Id == message.FromId);
                var user = new UserDTO();

                if (userVk is null)
                {
                    var groupVk = chatGroups?.FirstOrDefault(x => x.Id == Math.Abs(message.FromId!.Value)) ?? new Group();

                    user.Id = groupVk.Id;
                    user.PhotoUri = groupVk?.Photo100?.AbsoluteUri.ToString() ?? " ";
                    user.ScreenName = groupVk?.ScreenName;
                }
                else
                {
                    user.Id = userVk.Id;
                    user.PhotoUri = userVk.Photo100?.AbsoluteUri?.ToString() ?? " ";
                    user.ScreenName = userVk.ScreenName ?? " ";
                }

                messageList.Add(CreateMessageDto(message, user));
            }
            result.Data = messageList;
            return result;

        }


        public async Task<VKResponse> Login(string login, string password)
        {

            await api!.AuthorizeAsync(new ApiAuthParams
            {
                ApplicationId = _applicationId,
                Login = login,
                Password = password,
                Settings = Settings.All,
                TwoFactorAuthorization = () => Console.ReadLine()
            });

            this.StartMessagesHandling();
            return new VKResponse($"User {api.UserId} was logged in");

        }

        public async Task<VKResponse> Logout()
        {
            var id = api!.UserId;
            await api!.LogOutAsync();
            return new VKResponse($"User {id} logout");
        }

        public async Task<VKResponse> SendMessage(string message, long peerId, string file)
        {
            var extension = Path.GetExtension(file);
            UploadServerInfo uploadServer = null!;
            if (extension == ".ogg")
                uploadServer = api.Docs.GetMessagesUploadServer(api.UserId, DocMessageType.AudioMessage);
            else
                uploadServer = api.Docs.GetMessagesUploadServer(api.UserId);
            var response = await UploadFile(uploadServer.UploadUrl, file, extension);
            var title = Path.GetFileName(file); 
            var attachment = new List<MediaAttachment>
            {
                api.Docs.Save(   response, title ?? Guid.NewGuid().ToString())[0].Instance
            };
            var messageId = await api!.Messages.SendAsync(new MessagesSendParams
            {
                PeerId = peerId,
                Message = message,
                Attachments = attachment,
                RandomId = 0
            });

            return new VKResponse($"Message with id: {messageId} was sended");
        }
        private  byte[] GetBytes(string filePath) => File.ReadAllBytes(filePath);


        private  async Task<string> UploadFile(string serverUrl, string file, string fileExtension)
        {
            var data = GetBytes(file);

            using (var client = new HttpClient())
            {
                var requestContent = new MultipartFormDataContent();
                var content = new ByteArrayContent(data);
                content.Headers.ContentType = MediaTypeHeaderValue.Parse("multipart/form-data");
                requestContent.Add(content, "file", $"file.{fileExtension}");

                var response = client.PostAsync(serverUrl, requestContent).Result;
                return Encoding.Default.GetString(await response.Content.ReadAsByteArrayAsync());
            }
        }

      
        private void StartMessagesHandling()
        {
            LongPollServerResponse longPoolServerResponse = api.Messages.GetLongPollServer(needPts: true);
            ts = Convert.ToUInt64(longPoolServerResponse.Ts);
            pts = longPoolServerResponse.Pts;

            Task.Run(LongPollEventLoop);
        }

        private void LongPollEventLoop()
        {
            while (true)
            {
                try
                {
                    Thread.Sleep(500);
                    LongPollHistoryResponse longPollResponse = api!.Messages.GetLongPollHistory(new MessagesGetLongPollHistoryParams()
                    {
                        Ts = ts,
                        Pts = pts
                    });
                    pts = longPollResponse.NewPts;
                    Console.WriteLine("Messager update");
                    for (int i = 0; i < longPollResponse.History.Count; i++)
                    {
                        switch (longPollResponse.History[i][0])
                        {
                            case 4:

                                break;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

            }
        }
    }
}
