using BookujApi.Data;
using BookujApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;  // 🔥 JWT
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;                 // 🔥 JWT
using System.Text;                                    // 🔥 JWT
using Supabase;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Supabase Client DI
builder.Services.AddSingleton<Supabase.Client>(provider =>
{
    var url = builder.Configuration["Supabase:Url"];
    var key = builder.Configuration["Supabase:ServiceKey"];

    var client = new Supabase.Client(url, key);
    
    return client;
});

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<BusinessesService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("https://bookuj-app.vercel.app", "https://localhost:3000") //Frontend Adress!
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            );
});

// 🔥 JWT CONFIGURATION
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Możesz ustawić true na produkcji
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// ✅ build app AFTER registering services
var app = builder.Build();

app.UseRouting();

// Enable CORS
app.UseCors("AllowFrontend");

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 🔥 Authentication + Authorization middlewares
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
