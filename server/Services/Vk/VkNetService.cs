using ChatHub.HubR;
using ChatHub.Models.Vk;
using ChatHub.Models.Vk.DTO;
using Microsoft.AspNetCore.SignalR;
using NLog.Fluent;
using Serilog;
using server.Models.Vk.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using VkNet;
using VkNet.AudioBypassService.Extensions;
using VkNet.Enums.Filters;
using VkNet.Enums.StringEnums;
using VkNet.Model;

namespace ChatHub.Services.Vk
{
    public class VkNetService : IVKService
    {
        private readonly VkApi api;
        readonly Microsoft.Extensions.Logging.ILogger _logger;
        readonly IMapper _mapper;
        readonly IHubContext<ChatHubR> _chatHub;
        GetConversationsResult _conversation = null!;
        private List<User> Users = null!;
        private List<Group> Groups = null!;
        private long lastDialogId;
        private bool ApiBreak = false;
        private ulong? pts;
        private ulong ts;
        string lastLogin = "";
        string lastPassword = "";
        ulong _applicationId;
        bool buffer = false;
        public VkNetService(
            ILogger<VkNetService> logger,
            IMapper mapper,
            IHubContext<ChatHubR> chatHub,
            ulong appId)
        {
            _chatHub = chatHub;
            _logger = logger;
            _mapper = mapper;
            Serilog.Log.Logger = new LoggerConfiguration()
              .MinimumLevel
              .Debug()
              .WriteTo
              .Console()
           .CreateLogger();
            var services = new ServiceCollection();

            services.AddLogging(builder =>
            {
                builder.ClearProviders();
                builder.SetMinimumLevel(LogLevel.Debug);
                builder.AddSerilog(dispose: true);
            });
            services.AddAudioBypass();

            _applicationId = appId;
            api = new VkApi(services);

        }

        public async Task<VKResponse> GetDialogs(ulong offsetId, ulong limit)
        {
            buffer = true;

            ApiBreak = true;

            if (!api.IsAuthorized)
                return new VKResponse(StatusCodes.Status401Unauthorized, "Undefined user");


            if (_conversation == null)
            {
                await UpdateConversations();


            }

            var result = new VKResponse(StatusCodes.Status200OK, "Get dialogs");
            var list = new List<VkDialogDTO>();
            foreach (var conversation in _conversation.Items)
            {
                list.Add(CreateConversationDTO(conversation));
            }
            lastDialogId = list[0].Id;
            result.Data = list;
            ApiBreak = false;

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
                    var senderU = Users.FirstOrDefault(u => u.Id == conversation.LastMessage.FromId);
                    user = _mapper.Map<UserDTO>(senderU);
                    dialogDto.MainUsername = participant?.FirstName ?? " ";
                    if (participant != null)
                    {
                        name = $"{participant.FirstName} {participant.LastName}";
                    }
                    dialogDto.PhotoUri = participant?.Photo100?.AbsoluteUri ?? "";
                    break;
                case ConversationPeerType.Chat:
                    name = conversation.Conversation.ChatSettings.Title;
                    senderU = Users.FirstOrDefault(u => u.Id == conversation.LastMessage.FromId);
                    user = _mapper.Map<UserDTO>(senderU);
                    dialogDto.PhotoUri = conversation.Conversation.ChatSettings.Photo?.Photo100.ToString() ?? "";

                    break;
                case ConversationPeerType.Group:
                    var group = Groups.FirstOrDefault(f => f.Id == Math.Abs(id));
                    dialogDto.PhotoUri = group?.Photo100.AbsoluteUri.ToString() ?? " ";
                    dialogDto.MainUsername = group?.Name ?? " ";
                    var senderG = Groups.FirstOrDefault(u => u.Id == conversation.LastMessage.FromId);
                    user = _mapper.Map<UserDTO>(senderG);
                    name = group?.Name ?? "";
                    break;
            }

            dialogDto.Title = name;
            dialogDto.Id = id;
            dialogDto.TopMessage = CreateMessageDto(conversation.LastMessage, user, true);

            return dialogDto;
        }

        private VkMessageDTO CreateMessageDto(Message message, UserDTO user, bool isLast)
        {
            VkMessageDTO messageDTO = _mapper.Map<VkMessageDTO>(message);
            var attachaments = message.Attachments;
            if (attachaments.Count >= 1)
            {
                if (message.Text == "" && isLast)
                    messageDTO.Message = "Media message";
                var attachment = attachaments[0];
                messageDTO.Media = CreateMediaDTO(attachment);

            }
            messageDTO.Sender = CreatePeerDto(user);

            return messageDTO;
        }

        private VkPeerDTO? CreatePeerDto(UserDTO user)
            => _mapper.Map<VkPeerDTO>(user);


        private VkMediaDTO CreateMediaDTO(Attachment attachment)
        {
            var mediaDto = new VkMediaDTO(null!, null!);
            if (attachment.Type == typeof(Document))
            {
                var document = (Document)attachment.Instance;
                mediaDto.MediaUrl = document.Uri + " " + document.Title;
                mediaDto.Type = "Doc";
            }
            else if (attachment.Type == typeof(Photo))
            {
                var photo = (Photo)attachment.Instance;
                mediaDto.MediaUrl = photo.Sizes[^1].Url.ToString();
                mediaDto.Type = "Photo";
            }
            else if (attachment.Type == typeof(Video))
            {
                var video = (Video)attachment.Instance;
                mediaDto.MediaUrl = video.Player.AbsoluteUri;
                mediaDto.Type = "Video";
            }
            else if (attachment.Type == typeof(AudioMessage))
            {
                var audioMessage = (AudioMessage)attachment.Instance;
                mediaDto.MediaUrl = audioMessage.LinkMp3 == null ? audioMessage.LinkOgg.AbsoluteUri : audioMessage.LinkMp3.AbsoluteUri;
                mediaDto.Type = "VM";
            }
            else if (attachment.Type == typeof(Sticker))
            {
                var sticker = (Sticker)attachment.Instance;
                mediaDto.MediaUrl = sticker.Images.ToList()[^1].Url.AbsoluteUri;
                mediaDto.Type = "Sticker";
            }
            else
            {
                mediaDto.MediaUrl = null;
                mediaDto.Type = "Undefined";
            }

            return mediaDto;
        }

        public async Task<VKResponse> GetMessages(long chatId, int offsetId, int limit)
        {
            buffer = true;

            ApiBreak = true;

            if (!api.IsAuthorized)
                return new VKResponse(StatusCodes.Status401Unauthorized, "Undefined user");

            lastDialogId = chatId;



            Thread.Sleep(2000);

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
                    user.ScreenName = groupVk?.Name;
                }
                else
                {
                    user.Id = userVk.Id;
                    user.PhotoUri = userVk.Photo100?.AbsoluteUri?.ToString() ?? " ";
                    user.ScreenName = userVk.FirstName ?? " ";
                }

                messageList.Add(CreateMessageDto(message, user, false));
            }
            result.Data = messageList;
            ApiBreak = false;

            messageList.Reverse();

            return result;

        }


        public async Task<VKResponse> Login(string login, string password, string code)
        {
            buffer = true;

            ApiBreak = true;
            if (lastPassword != "" && lastLogin != "")
            {
                login = lastLogin;
                password = lastPassword;
            }
            var response = new VKResponse();
            try
            {
                await api!.AuthorizeAsync(new ApiAuthParams
                {
                    ApplicationId = _applicationId,
                    //Login = login,
                    //Password = password,
                    AccessToken = "vk1.a.l1pjFy0OdCeJN5ltDveqMYfpRqUeWQXKjuz0uVTdH927GvBXDoizJPAhcVs5fDE6liU9XT86x1bYpLyHVsJmEEJoRD1N6L9x6xLSV1O_SEU5B20BZoxQwSNXCGpa9j5Bdj9ARS0cJSj4NRA-kpz4DylbiW3babYYMNcqbA-jEizyhHpj-azoc4cw6nHRziDV",
                    Settings = Settings.All,
                    TwoFactorAuthorization = () =>
                    {
                        if (code == "")
                        {

                            throw new ArgumentException("Enter autentification code");
                        }
                        return code;
                    }
                });

                User? user = api.Users.Get(new[] { api.UserId!.Value }, ProfileFields.Photo100 | ProfileFields.ScreenName).FirstOrDefault();
                response.StatusCode = 200;
                response.Message = $"User {api.UserId} was logged in";
                response.Data = CreatePeerDto(_mapper.Map<UserDTO>(user));
                StartMessagesHandling();
                lastLogin = "";
                lastPassword = "";
            }
            catch (ArgumentException ex)
            {
                lastLogin = login;
                lastPassword = password;
                response.StatusCode = 200;
                response.Message = "Enter autentification code";
            }
            Console.WriteLine(api.Token);
            ApiBreak = false;

            return response;

        }

        public async Task<VKResponse> Logout()
        {
            var id = api!.UserId;
            await api!.LogOutAsync();
            return new VKResponse($"User {id} logout");
        }



        private void StartMessagesHandling()
        {
            LongPollServerResponse longPoolServerResponse = api.Messages.GetLongPollServer(needPts: true);
            ts = Convert.ToUInt64(longPoolServerResponse.Ts);
            pts = longPoolServerResponse.Pts;

            Task.Run(LongPollEventLoop);
        }

        public async Task<VKResponse> SendMessage(string message, long peerId, string file)
        {
            buffer = true;
            ApiBreak = true;
            VkMessageDTO messageDto = new();
            UserDTO user = new UserDTO();
            if (file != "")
            {
                Thread.Sleep(2000);

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
                Thread.Sleep(2000);
                var messageId = await api!.Messages.SendAsync(new MessagesSendParams
                {
                    PeerId = peerId,
                    Message = message,
                    Attachments = attachment,
                    RandomId = 0
                });
                Thread.Sleep(2000);

                User? sender = api.Users.Get(new[] { api.UserId!.Value }, ProfileFields.Photo100 | ProfileFields.ScreenName).FirstOrDefault();

                messageDto.Sender = CreatePeerDto(_mapper.Map<UserDTO>(sender));
                messageDto.Message = message;
                messageDto.Id = messageId;
                messageDto.Date = DateTime.Now;
                messageDto.Media = new VkMediaDTO("Doc", response);
            }
            else
            {
                var messageId = await api!.Messages.SendAsync(new MessagesSendParams
                {
                    PeerId = peerId,
                    Message = message,
                    RandomId = 0
                });
                User? sender = api.Users.Get(new[] { api.UserId!.Value }, ProfileFields.Photo100 | ProfileFields.ScreenName).FirstOrDefault();

                messageDto.Sender = CreatePeerDto(_mapper.Map<UserDTO>(sender));
                messageDto.Message = message;
                messageDto.Id = messageId;
                messageDto.Date = DateTime.Now;
                messageDto.Media = null;
            }
            ApiBreak = false;
            var result = new VKResponse(200, $"Message was sended");
            result.Data = messageDto;
            return result;
        }
        private byte[] GetBytes(string filePath) => File.ReadAllBytes(filePath);


        private async Task<string> UploadFile(string serverUrl, string file, string fileExtension)
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

        private async Task SendUpdatedConversations()
        {
            var dialogs = await GetDialogs(0, 200);
            await ChatHubR.UpdateDialogsVK(
            _chatHub,
                new HubEntity { Id = api.UserId ?? 0, Data = dialogs.Data }
            );
            _logger.Log(LogLevel.Information, "Updated dialogs were sended");
        }

        private async Task SendUpdatedMessages()
        {
            var dialogs = await GetMessages(lastDialogId, 0, 50);
            await ChatHubR.UpdateMessagesVK(
            _chatHub,
                new HubEntity { Id = lastDialogId, Data = dialogs.Data }
            );
            _logger.Log(LogLevel.Information, "Updated dialogs were sended");
        }

        private async Task UpdateConversations()
        {
            _conversation = await api.Messages.GetConversationsAsync(new GetConversationsParams()
            {
                Count = 200,
                Offset = 0

            });
            var userIds = _conversation.Items
                .Where(chat => chat.Conversation.Peer.Type == ConversationPeerType.User)
                .Select(chat => chat.Conversation.Peer.Id)
                .ToList();

            var lastMessageUserIds = _conversation.Items
                .Where(chat => chat.Conversation.Peer.Type == ConversationPeerType.User)
                .Select(chat => chat.LastMessage.FromId)
                .Select(id => id!.Value)
                .ToList();

            userIds.AddRange(lastMessageUserIds);
            userIds = userIds.Distinct().ToList();

            var groupIds = _conversation.Items
                .Where(chat => chat.Conversation.Peer.Type == ConversationPeerType.Group)
                .Select(chat => Math.Abs(chat.Conversation.Peer.Id).ToString())
                .ToList();
            Thread.Sleep(2000);
            if (userIds != null)
                Users = (await api!.Users.GetAsync(userIds, ProfileFields.Photo100 | ProfileFields.ScreenName | ProfileFields.FirstName | ProfileFields.LastName)).ToList();
            if (groupIds != null)
                Groups = (await api.Groups.GetByIdAsync(groupIds, null, GroupsFields.All)).ToList();
        }

        private async void LongPollEventLoop()
        {
            bool messageUpdate = false;
            while (true)
            {
                try
                {
                    if (!ApiBreak)
                    {

                        if (buffer)
                        {
                            Thread.Sleep(2000);
                            buffer = false;
                        }
                        Thread.Sleep(3000);
                        LongPollHistoryResponse longPollResponse = api!.Messages.GetLongPollHistory(new MessagesGetLongPollHistoryParams()
                        {
                            Ts = ts,
                            Pts = pts
                        });
                        pts = longPollResponse.NewPts;
                        Console.WriteLine("Messages update");
                        Console.WriteLine(api.Status);
                        messageUpdate = false;
                        for (int i = 0; i < longPollResponse.History.Count; i++)
                        {
                            switch (longPollResponse.History[i][0])
                            {
                                case 4:
                                    await UpdateConversations();
                                    Thread.Sleep(2000);
                                    await SendUpdatedMessages();
                                    Thread.Sleep(2000);
                                    await SendUpdatedConversations();

                                    messageUpdate = true;
                                    break;
                            }
                            if (messageUpdate)
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
