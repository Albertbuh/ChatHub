using TL;
using ChatHub.Services.Telegram;

namespace ChatHub.Api;

public static class TelegramApi
{
  public static IEndpointRouteBuilder MapTelegramApi(this RouteGroupBuilder app)
  {
    app.MapPost("/login", Login);
    app.MapGet("/logout", Logout);
    app.MapGet("/dialogs", GetDialogs);
    app.MapPost("/peers/{chatId}", SendMessage);
    app.MapGet("/peers/{chatId}", GetMessages);
    
    return app;
  }

  private static async Task<IResult> Login(ITLService telegramService, string info)
  {
    var result = await telegramService.Login(info);
    return TypedResults.Json(result);
  }

  private static async Task<IResult> Logout(ITLService telegramService)
  {
    var result = await telegramService.Logout();
    return TypedResults.Json(result);
  }

  private static async Task<IResult> SendMessage(ITLService telegramService, long chatId, string message)
  {
    var result = await telegramService.SendMessage(chatId, message);
    return TypedResults.Json(result);
  }

  private static async Task<IResult> GetMessages(ITLService telegramService, long chatId)
  {
    var result = await telegramService.GetAllMessages(chatId);
    return TypedResults.Json(result);
  }
  
  private static async Task<IResult> GetDialogs(ITLService telegramService)
  {
    var result = await telegramService.GetAllDialogs();
    if(result.Data is Messages_Dialogs dialogs)
      return TypedResults.Json(dialogs);
    else 
      return TypedResults.Json(result);
  }
}
