using BookujApi.Data;
using BookujApi.Enums;
using BookujApi.Models;
using BookujApi.Models.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace BookujApi.Services
{
    public class UserService
    {
        private readonly AppDbContext _db;
        private readonly Supabase.Client _cdn;
        private readonly IConfiguration _config;


        public UserService(AppDbContext db, Supabase.Client cdn, IConfiguration config)
        {
            _db = db;
            _cdn = cdn;
            _config = config;
        }

        public async Task<User> RegisterUserAsync(RegisterUserDto dto)
        {
            // Check if user with this email address already exists
            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.ToLowerInvariant());
            if (existing != null)
                throw new Exception("Email is already registered.");
            else if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                throw new ValidationException("Password must be at least 6 characters long");
            else if (!Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                throw new ValidationException("Invalid email format");
            else if (!Regex.IsMatch(dto.PhoneNumber, @"^\+?\d{7,14}$"))
                throw new ValidationException("Invalid phone number format");

            //Hashowanie hasła
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            //Tworzenie encji User
            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email.ToLowerInvariant(),
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = hashedPassword,
                Role = UserRole.Client, // domyślnie klient
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            //Zapis do bazy
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return user;
        }

        // ✅ Get all users
        public async Task<List<User>> GetAllUsers()
        {
            var users = await _db.Users.ToListAsync();
            return users;
        }

        // ✅ Delete user by e-mail
        public async Task<System.Guid> DeleteUserByEmail(string email)
        {
            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existing == null)
            {
                throw new KeyNotFoundException("Email does not exist");
            }

            _db.Users.Remove(existing);
            await _db.SaveChangesAsync();
            return existing.Id;
        }

        // ✅ LogIn
        public async Task<LoginResponseDto> LoginUser(string email, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new Exception("Email does not exist");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

            if (!isPasswordValid)
                throw new Exception("Invalid password");

            // ✅ Access token
            var accessToken = GenerateJwtToken(user, _config);

            // ✅ Refresh token
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30); //30 days

            await _db.SaveChangesAsync();

            return new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = MapToUserDto(user)
            };
        }

        public async Task<bool> LogoutUser(string userId)
        {
            if (userId == null)
                throw new ArgumentNullException("User id is missing");

            Guid userGuid;
            if (!Guid.TryParse(userId, out userGuid))
                throw new Exception("Failed to parse userId to Guid");

            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Id == userGuid);

            if (existing == null)
                throw new KeyNotFoundException("User is not found");

            existing.RefreshToken = null;
            existing.RefreshTokenExpiry = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return true;
        }

        // ✅ Generate token
        public string GenerateJwtToken(User user, IConfiguration config)
        {
            var jwtSettings = config.GetSection("Jwt");

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        // ✅ Generate refresh token
        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            }
        }

        public async Task<LoginResponseDto> RefreshToken(string refreshToken)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null)
                throw new Exception("Invalid refresh token");

            if (user.RefreshTokenExpiry < DateTime.UtcNow)
                throw new Exception("Refresh token expired");

            // Generate new tokens
            var newAccessToken = GenerateJwtToken(user, _config);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);

            await _db.SaveChangesAsync();

            return new LoginResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                User = MapToUserDto(user)
            };
        }


        // ✅ SetRole
        public async Task<SetRoleResult> SetUserRole(UserRole newRole, string userId)
        {
            if (newRole == UserRole.Admin)
            {
                return SetRoleResult.Forbidden;
            }
            else if (newRole == UserRole.Client || newRole == UserRole.Owner)
            {
                var existing = await _db.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

                if (existing == null)
                    return SetRoleResult.UserNotFound;

                existing.Role = newRole;

                _db.Users.Update(existing);
                await _db.SaveChangesAsync();
                return SetRoleResult.Success;

            }
            else
            {
                return SetRoleResult.InvalidRole;
            }
        }
        public async Task<UserPersonalInformationDto> EditUserPersonalData(UserPersonalInformationDto userPersonalData, string? userId, string? publicUrl)
        {
            if (string.IsNullOrWhiteSpace(userPersonalData.FirstName) ||
                string.IsNullOrWhiteSpace(userPersonalData.LastName) ||
                string.IsNullOrWhiteSpace(userPersonalData.Email) ||
                string.IsNullOrWhiteSpace(userPersonalData.PhoneNumber))
            {
                throw new ValidationException("Missing required user fields");
            }
            else if (!Regex.IsMatch(userPersonalData.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                throw new ValidationException("Invalid email format");
            else if (!Regex.IsMatch(userPersonalData.PhoneNumber, @"^\+?\d{7,14}$"))
                throw new ValidationException("Invalid phone number format");

            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (existing == null)
                throw new Exception("User not found");

            var isTaken = await _db.Users.AnyAsync(u => u.Email == userPersonalData.Email.ToLowerInvariant() && u.Id.ToString() != userId);
            if (isTaken)
                throw new Exception("Email is already taken");


            existing.FirstName = userPersonalData.FirstName;
            existing.LastName = userPersonalData.LastName;
            existing.Email = userPersonalData.Email.ToLowerInvariant();
            existing.PhoneNumber = userPersonalData.PhoneNumber;
            if (publicUrl != null)
                existing.ImageUrl = publicUrl;

            await _db.SaveChangesAsync();
            return new UserPersonalInformationDto
            {
                FirstName = existing.FirstName,
                LastName = existing.LastName,
                Email = existing.Email,
                PhoneNumber = existing.PhoneNumber,
                File = null,
                ImageUrl = existing.ImageUrl,
            };
        }


        public async Task<User> GetMe(string userId)
        {
            Guid userGuid;
            if (!Guid.TryParse(userId, out userGuid))
                throw new Exception("Failed to parse userId to Guid");

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userGuid);
            if (user == null)
                throw new KeyNotFoundException("User is not found");

            return user;
        }

        public async Task<string> UploadUserProfilePicture(IFormFile file, string? oldUrl)
        {
            await _cdn.InitializeAsync();

            var storage = _cdn.Storage;

            if (!string.IsNullOrEmpty(oldUrl))
            {
                var oldFileName = oldUrl.Split('/').Last();
                try
                {
                    await storage.From("profile-images").Remove(oldFileName);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[WARN] Failed to delete old profile picture: {ex.Message}");
                }
            }

            string fileName = $"{Guid.NewGuid()}_{file.FileName}";

            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            await storage.From("profile-images").Upload(fileBytes, fileName);

            string publicUrl = storage.From("profile-images").GetPublicUrl(fileName);

            return publicUrl;
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
