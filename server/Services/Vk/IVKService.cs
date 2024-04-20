using server.Models.Vk;

namespace ChatHub.Services.Vk
{
    public interface IVKService
    {
        public Task<VKResponse> Login(string login, string password);
        public Task<VKResponse> Logout();
        public Task<VKResponse> GetDialogs(ulong offsetId, ulong limit);
        public Task<VKResponse> GetMessages(long chatId, int offsetId, int limit);
        public Task<VKResponse> SendMessage(string message, long peerId);
    }
}
