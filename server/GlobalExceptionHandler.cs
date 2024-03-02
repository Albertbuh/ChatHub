public sealed class GlobalExceptionHandler: IExceptionHandler
{
  private readonly ILogger<GlobalExceptionHandler> _logger;

  public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
  {
    _logger = logger;
  }

  public async ValueTask<bool> TryHandleAsync(
      HttpContext context,
      Exception exception,
      CancellationToken cancellationToken)
  {
    _logger.LogError(exception, $"Exception occured: {exception.Message}");

    var problemDetails = new Microsoft.AspNetCore.Mvc.ProblemDetails
    {
      Status = StatusCodes.Status500InternalServerError,
      Title = "Server error",
      Detail = exception.Message
    };

    await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
    return true;
  }
}
