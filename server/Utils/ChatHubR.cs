using ChatHub.Models.Telegram.DTO;
using Microsoft.AspNetCore.SignalR;

namespace server.HubR
{
    public class ChatHubR : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"User: {Context.ConnectionId} connected");
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Disconnected {Context.ConnectionId} disconnected");
            await base.OnDisconnectedAsync(exception);
        }

        public static async Task UpdateDialogsTL(IHubContext<ChatHubR> chatHub,Object? dialogs)
        {
            await chatHub.Clients.All.SendAsync("updateDialogsTL", dialogs);
        }
    }
}