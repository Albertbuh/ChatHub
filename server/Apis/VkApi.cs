using ChatHub.Models.Vk;
using ChatHub.Models.Telegram.DTO;
using ChatHub.Models.Vk;
using ChatHub.Services.Vk;
using server.Models.Vk;

namespace ChatHub.Apis
{
    public static class VkApi
    {
        static bool lastRequest = false;
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

        private static async Task<IResult> SendMessage(IVKService vkService, long chatId, VKChatRequest chatRequest)
        {
            var result = await vkService.SendMessage(chatRequest.Message, chatId, chatRequest.MediaFilepath);
            return TypedResults.Json(result);


        }

        private static async Task<IResult> GetMessages(IVKService vkService, long chatId, int offset, int limit)
        {
            count++;
            Console.WriteLine("Started");

            var result = await vkService.GetMessages(chatId, offset, limit);
            Console.WriteLine("Success");
            return TypedResults.Json(result);

        }

        private static async Task<IResult> GetDialogs(IVKService vkService, ulong offsetId, ulong limit)
        {
            Console.WriteLine("Started");
            VKResponse result;
            while (lastRequest)
            {
            }
                lastRequest = true;
                result = await vkService.GetDialogs(offsetId, limit);
                lastRequest = false;
            Console.WriteLine("Success");

            return TypedResults.Json(result);


        }
    }
}
