using ChatHub.Models.Telegram;
using ChatHub.Models.Telegram.DTO;
using ChatHub.Services.Telegram;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ChatHub.Api;

public static class TelegramApi
{
    public static IEndpointRouteBuilder MapTelegramApi(this RouteGroupBuilder app)
    {
        app.MapPost("/login", Login);
        app.MapGet("/logout", Logout);
        app.MapGet("/dialogs", GetDialogs);
        app.MapPost("/peers/{chatId}", PostMessage);
        app.MapGet("/peers/{chatId}", GetMessages);

        return app;
    }

    private static async Task<Ok<TLResponse>> Login(ITLService telegramService, string info)
    {
        var result = await telegramService.Login(info);
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<TLResponse>> Logout(ITLService telegramService)
    {
        var result = await telegramService.Logout();
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Created<TLResponse>, BadRequest<TLResponse>>> PostMessage(
        ITLService telegramService,
        long peerId,
        TLChatRequest request
    )
    {
        if (request.MediaFilepath == null && request.Message == null)
            return TypedResults.BadRequest(
                new TLResponse(StatusCodes.Status400BadRequest, $"Nothing to send for {peerId}")
            );

        var result = await telegramService.SendMessage(peerId, request.Message, request.MediaFilepath);
        long id = 0;
        if (result.Data is MessageDTO m)
            id = m.Id;
        return TypedResults.Created($"/peers/{peerId}/messages/{id}", result);
    }

    private static async Task<Ok<TLResponse>> GetMessages(
        ITLService telegramService,
        long chatId,
        int offset,
        int limit
    )
    {
        var result = await telegramService.GetMessages(chatId, offset, limit);
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<TLResponse>> GetDialogs(ITLService telegramService)
    {
        var result = await telegramService.GetAllDialogs();
        return TypedResults.Ok(result);
    }
}
