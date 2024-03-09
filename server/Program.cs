
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors((options) => 
    {
      options.AddPolicy("AllowReactOrigin",
      builder => builder.WithOrigins("http://localhost:44144")
      .AllowAnyHeader()
      .AllowAnyMethod());
    });

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddControllers();


var app = builder.Build();
app.UseExceptionHandler();
app.UseCors("AllowReactOrigin");

app.MapGet("/", (HttpContext context) =>
   {
       context.Response.Redirect("http://localhost:44144", true);
   });

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});


app.Run();
