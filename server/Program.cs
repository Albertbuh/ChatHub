var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors((options) => 
    {
      options.AddPolicy("AllowReactOrigin",
      builder => builder.WithOrigins("http://localhost:44144")
      .AllowAnyHeader()
      .AllowAnyMethod());
    });

var app = builder.Build();
app.UseCors("AllowReactOrigin");

app.MapGet("/", (HttpContext context) => 
    {
      context.Response.Redirect("http://localhost:44144", true);
    });

app.Run();
