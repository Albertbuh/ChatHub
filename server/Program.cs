using ChatHub.Api;
using ChatHub.Extensions;
using ChatHub.Apis;
using ChatHub.Utils.Hub;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services
    .AddCors(
        (options) =>
        {
            options.AddPolicy(
                "AllowReactOrigin",
                builder => builder.WithOrigins("http://localhost:44144").AllowAnyHeader().AllowAnyMethod().AllowCredentials()
            );
        }
    );

builder.Services.AddEndpointsApiExplorer();
builder
    .Services
    .AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(ChatHub.Mappers.Telegram.WClientMapperProfile), typeof(ChatHub.Mappers.Vk.VkNetMapperProfile));
builder.Services.AddTelegramApiService();
builder.Services.AddVkApiService();

builder.Services.AddSignalR();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();
app.UseExceptionHandler();

app.UseCors("AllowReactOrigin");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = String.Empty;
    });
}
else if (app.Environment.IsProduction())
{
    app.UseCors("AllowReactOrigin");
    app.MapGet(
        "/",
        (HttpContext context) => context.Response.Redirect("http://localhost:44144", true)
    );
}

app.MapHub<TelegramHubR>("/hub/telegram");
app.MapHub<VkHubR>("/hub/vkontakte");

app.MapGroup("/api/v1.0/telegram").WithTags("Telegram api").MapTelegramApi();
app.MapGroup("/api/v1.0/vk").WithTags("Vk api").MapVkApi();

app.Run();
