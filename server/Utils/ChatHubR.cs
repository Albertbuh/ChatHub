using Microsoft.AspNetCore.SignalR;

namespace ChatHub.HubR
{
    public class ChatHubR : Hub
    {
        private readonly HashSet<string> connectionIds = new HashSet<string>();
        public override async Task OnConnectedAsync()
        {
            var clients = connectionIds.ToList();
            connectionIds.Add(Context.ConnectionId);
            foreach (var client in clients)
            {
                var connection = Clients.Client(Context.ConnectionId);
                var connectionContext = connection?.GetType().GetProperty("ConnectionContext")?.GetValue(connection) as HubConnectionContext;
                connectionContext?.Abort();

            }
            Console.WriteLine($"User: {Context.ConnectionId} connected");
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Disconnected {Context.ConnectionId} disconnected");
            await base.OnDisconnectedAsync(exception);
        }

        public static async Task UpdateDialogsTL(IHubContext<ChatHubR> chatHub, HubEntity? dialogs)
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
