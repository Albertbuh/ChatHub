using ChatHub.Models.Telegram.DTO;
using ChatHub.Services.Vk;

namespace ChatHub.Apis
{
    public static class VkApi
    {
        public static IEndpointRouteBuilder MapVkApi(this RouteGroupBuilder app)
        {
            app.MapPost("/login", Login);
            app.MapGet("/logout", Logout);
            app.MapGet("/dialogs", GetDialogs);
            app.MapPost("/peers/{chatId}", SendMessage);
            app.MapGet("/peers/{chatId}", GetMessages);

            return app;
        }

        private static async Task<IResult> Login(IVKService vkService, string login, string password)
        {
            var result = await vkService.Login(login, password);
            return TypedResults.Json(result);
        }

        private static async Task<IResult> Logout(IVKService vkService)
        {
            var result = await vkService.Logout();
            return TypedResults.Json(result);

        }

        private static async Task<IResult> SendMessage(IVKService vkService, string message, long peerId)
        {
            var result = await vkService.SendMessage(message, peerId);
            return TypedResults.Json(result);


        }

        private static async Task<IResult> GetMessages(IVKService vkService, long chatId, int offsetId, int limit)
        {

            var result = await vkService.GetMessages(chatId, offsetId, limit);
            return TypedResults.Json(result);

        }

        private static async Task<IResult> GetDialogs(IVKService vkService, ulong offsetId, ulong limit)
        {
            var result = await vkService.GetDialogs(offsetId, limit);
            if (result.Data is List<DialogDTO> dialogs)
                return TypedResults.Ok(dialogs);
            else
                return TypedResults.Json(result);

        }
    }
}
