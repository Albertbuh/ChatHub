using ChatHub.Services.Telegram;

namespace ChatHub.Extensions;

public static class ServiceProviderExtensions
{
	public static void AddTelegramApiService(
		this IServiceCollection services,
		int apiId = 0,
		string apiHash = ""
	)
	{
		if (apiId == 0)
		{
			Int32.TryParse(Environment.GetEnvironmentVariable("TELEGRAM_API_ID"), out apiId);
			if (apiId == 0)
				throw new InvalidOperationException(
					"Couldn't find telegram api id. Setup Environment variable \"TELEGRAM_API_ID\" with relevant value."
				);
		}
		if (String.IsNullOrEmpty(apiHash))
		{
			apiHash = Environment.GetEnvironmentVariable("TELEGRAM_API_HASH") ?? "";
			if (String.IsNullOrEmpty(apiHash))
				throw new InvalidOperationException(
					"Couldn't find telegram api hash. Setup Environment variable \"TELEGRAM_API_HASH\" with relevant value."
				);
		}

		services.AddSingleton<ITLService, WClientTLService>(
			_ => new WClientTLService(_.GetRequiredService<ILogger<WClientTLService>>(), _.GetRequiredService<IMapper>(), apiId, apiHash)
		);
	}
}
