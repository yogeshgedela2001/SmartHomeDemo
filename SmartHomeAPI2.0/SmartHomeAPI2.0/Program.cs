using Microsoft.EntityFrameworkCore;
using SmartHomeAPI2._0.Data;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<SmartHomeContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Add MVC services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole(); // Add console logging
    logging.AddDebug();   // Add debug logging
    // Additional logging providers can be added here
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowAllOrigins");

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Custom error handling middleware
app.Use(async (context, next) =>
{
    try
    {
        await next.Invoke(); // Call the next middleware
    }
    catch (Exception ex)
    {
        // Log the exception using the built-in logging framework
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An unhandled exception occurred while processing the request.");

        context.Response.StatusCode = StatusCodes.Status500InternalServerError; // Set the response status code
        await context.Response.WriteAsync("An unexpected error occurred. Please try again later."); // Send the error response
    }
});

// Enable authorization
app.UseAuthorization();

// Map controllers to endpoints
app.MapControllers();

// Run the application
app.Run();
