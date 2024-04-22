using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using VkNet.Model;

namespace ChatHub.HubR
{
    public class ChatHubR : Hub
    {
        private readonly ConcurrentDictionary<string, string> connectionIds = new ConcurrentDictionary<string, string>();
        private object lockObject = new();
        public override async Task OnConnectedAsync()
        {
            lock (lockObject)
            {
                connectionIds.TryAdd(Context.ConnectionId, Context.ConnectionId);
                foreach (var client in connectionIds)
                {
                    if (client.Key != Context.ConnectionId)
                    {
                        var connection = Clients.Client(client.Key);
                        var connectionContext = connection?.GetType().GetProperty("ConnectionContext")?.GetValue(connection) as HubConnectionContext;
                        connectionContext?.Abort();
                    }


                }
            }
            Console.WriteLine($"User: {Context.ConnectionId} connected");
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Disconnected {Context.ConnectionId} disconnected");
            await base.OnDisconnectedAsync(exception);
        }

        public static async Task UpdateDialogsTL(IHubContext<ChatHubR> chatHub,HubEntity? dialogs)
        {
            await chatHub.Clients.All.SendAsync("updateDialogsTL", dialogs);
        }

        public static async Task UpdateDialogsVK(IHubContext<ChatHubR> chatHub, HubEntity? dialogs)
        {
            await chatHub.Clients.All.SendAsync("updateDialogsVk", dialogs);
        }

        public static async Task UpdateMessagesVK(IHubContext<ChatHubR> chatHub, HubEntity? messages)
        {
            await chatHub.Clients.All.SendAsync("updateMessagesVk", messages);
        }

        public static async Task UpdateMessagesTL(IHubContext<ChatHubR> chatHub, HubEntity? messages)
        {
            await chatHub.Clients.All.SendAsync("updateMessagesTL", messages);
        }
    }
}
