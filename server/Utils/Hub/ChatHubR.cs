using Microsoft.AspNetCore.SignalR;

namespace ChatHub.Utils.Hub
{
    public class ChatHubR : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly HashSet<string> connectionIds = new HashSet<string>();
        private object lockObject = new();
        public override async Task OnConnectedAsync()
        {
            lock (lockObject)
            {
                connectionIds.Add(Context.ConnectionId);
                foreach (var client in connectionIds)
                {
                    if (client != Context.ConnectionId)
                    {
                        var connection = Clients.Client(client);
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

        public static async Task UpdateDialogs(IHubContext<ChatHubR> chatHub, HubEntity? dialogs)
        {
            await chatHub.Clients.All.SendAsync("updateDialogs", dialogs);
        }

        public static async Task UpdateMessages(IHubContext<ChatHubR> chatHub, HubEntity? messages)
        {
            await chatHub.Clients.All.SendAsync("updateMessages", messages);
        }
    }
}
