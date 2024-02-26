using ChatHub.Models.Telegram;
namespace ChatHub.Services.Telegram;

public interface ITLService
{
  public Task<TLResponse> Login(string loginInfo);
  public Task<TLResponse> Logout();
  public Task<TLResponse> GetAllDialogs();
  public Task<TLResponse> GetAllMessages(long chatId);
  public Task<TLResponse> SendMessage(long chatId, string message);
}
