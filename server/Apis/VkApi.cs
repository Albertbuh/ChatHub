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

        static int count = 0;

        private static async Task<IResult> Login(IVKService vkService, string login, string password, string code = "")
        {
            var result = await vkService.Login(login, password, code);
            return TypedResults.Json(result);
        }

        private static async Task<IResult> Logout(IVKService vkService)
        {
            var result = await vkService.Logout();
            return TypedResults.Json(result);

        }

        private static async Task<IResult> SendMessage(IVKService vkService, long peerId, string message = "", string file = "")
        {
            var result = await vkService.SendMessage(message, peerId, file);
            return TypedResults.Json(result);


        }

        private static async Task<IResult> GetMessages(IVKService vkService, long chatId, int offset, int limit)
        {
            count++;
            var result = await vkService.GetMessages(chatId, offset, limit);
            return TypedResults.Json(result);

        }

        private static async Task<IResult> GetDialogs(IVKService vkService, ulong offsetId, ulong limit)
        {
            var result = await vkService.GetDialogs(offsetId, limit);

            return TypedResults.Json(result);

        }
    }
}
