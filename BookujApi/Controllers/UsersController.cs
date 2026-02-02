using BookujApi.Enums;
using BookujApi.Models.Dto;
using BookujApi.Models.Requests;
using BookujApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace BookujApi.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(dto);

                return Ok(new
                {
                    message = "User registered successfully",
                    user = new
                    {
                        user.Id,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> Users()
        {
            try
            {
                var all_users = await _userService.GetAllUsers();


                return Ok(all_users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteByEmail([FromQuery] string email)
        {
            try
            {
                var result = await _userService.DeleteUserByEmail(email);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                // User not found, return 404
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });

            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestOrig request)
        {
            try
            {
                var response = await _userService.LoginUser(request.Email, request.Password);
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(30), //Valid for 30 days
                    Path = "/"
                };
                Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

                return Ok(new
                {
                    accessToken = response.AccessToken,
                    user = response.User
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var result = await _userService.LogoutUser(userId);
                Response.Cookies.Delete("refreshToken");
                return Ok(new { success = true, message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                    return Unauthorized(new { error = "Refresh token is missing" });

                var response = await _userService.RefreshToken(refreshToken);
                if (!string.IsNullOrEmpty(response.RefreshToken))
                {
                    Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddDays(30), //Valid for 30 days
                        Path = "/"
                    });
                }

                return Ok(new { accessToken = response.AccessToken, user = response.User });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPatch("me/personalData")]
        public async Task<IActionResult> EditUserPersonalData([FromForm] UserPersonalInformationDto user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToArray();

                    return BadRequest(new { error = string.Join(", ", errors) });
                }

                if (user == null)
                    return BadRequest(new { error = "User data is empty" });

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var userData = await _userService.GetMe(userId);

                string? publicUrl = null;
                if (user.File != null)
                {
                    publicUrl = await _userService.UploadUserProfilePicture(user.File, userData.ImageUrl);
                }

                var result = await _userService.EditUserPersonalData(user, userId, publicUrl);
                return Ok(new { success = true, message = "User personal data edited successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("editRole")]
        public async Task<IActionResult> EditRole([FromBody] UserRole newRole)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var result = await _userService.SetUserRole(newRole, userId);
                switch (result)
                {
                    case SetRoleResult.Success:
                        var refreshToken = Request.Cookies["refreshToken"];

                        if (string.IsNullOrEmpty(refreshToken))
                            return Unauthorized(new { error = "Refresh token is missing" });

                        var response = await _userService.RefreshToken(refreshToken);

                        if (!string.IsNullOrEmpty(response.RefreshToken))
                        {
                            Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
                            {
                                HttpOnly = true,
                                Secure = true,
                                SameSite = SameSiteMode.None,
                                Expires = DateTime.UtcNow.AddDays(30), //Valid for 30 days
                                Path = "/"
                            });
                        }

                        return Ok(new { message = "Role updated", userData = response.User, accessToken = response.AccessToken });

                    case SetRoleResult.UserNotFound: return NotFound(new { error = "User not found" });
                    case SetRoleResult.Forbidden: return StatusCode(403, new { error = "Role change forbidden." });
                    case SetRoleResult.InvalidRole: return BadRequest(new { error = "Invalid role" });
                    default: return StatusCode(500);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                    return Unauthorized();

                var user = await _userService.GetMe(userId);
                if (user == null)
                    return NotFound();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
