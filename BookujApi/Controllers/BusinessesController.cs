using BookujApi.Enums;
using BookujApi.Models.Dto;
using BookujApi.Models.Forms;
using BookujApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;


namespace BookujApi.Controllers
{
    [ApiController]
    [Route("api/businesses")]
    public class BusinessesController : ControllerBase
    {
        private readonly BusinessesService _businessService;

        public BusinessesController(BusinessesService businessService)
        {
            _businessService = businessService;
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpPost("me")]
        public async Task<IActionResult> AddMyBusiness([FromForm] BusinessForm form)
        {
            if (form == null)
                return BadRequest("Form cannot be null.");

            BusinessDto? business;

            try
            {
                business = JsonConvert.DeserializeObject<BusinessDto>(form.Json);
            }
            catch
            {
                return BadRequest(new { error = "invalid JSON format" });
            }

            if (business is null)
            {
                return BadRequest("Business cannot be null.");
            }

            
            if (!TryValidateModel(business))
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToArray();

                return BadRequest(new { error = string.Join(", ", errors) });
            }

            try
            {
                string? publicUrl=null;
                if (form.File != null)
                {
                    publicUrl = await _businessService.UploadBusinessPicture(form.File, "profile-pictures");
                }

                var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var newBusiness = await _businessService.AddNewBusinessToOwner(ownerId, business, publicUrl);
                return Ok(newBusiness);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyBusinesses()
        {
            try
            {
                var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                List<BusinessListItemDto> businessesDtoList = await _businessService.GetAllOwnersBusinessesToList(ownerId);

                return Ok(businessesDtoList);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpGet("me/{businessId}")]
        public async Task<IActionResult> GetMyBusiness(string businessId)
        {
            try
            {
                var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (ownerId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var business = await _businessService.GetOwnersBusiness(ownerId, businessId);
                if (business == null)
                    return NotFound(new { error = "Business not found" });

                return Ok(business);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize(Roles = "Admin, Owner")]
        [HttpDelete("me/{businessId}")]
        public async Task<IActionResult> RemoveMyBusiness(string businessId)
        {
            try
            {
                var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (ownerId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var removedBusiness = await _businessService.RemoveOwnersBusinessById(ownerId, businessId);
                return Ok(removedBusiness);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpGet("me/{businessId}/services")]
        public async Task<IActionResult> GetMyServices(string businessId)
        {
            try
            {
                var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (ownerId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var services = await _businessService.GetServicesFromMyBusiness(ownerId, businessId);

                return Ok(services);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpPost("me/{businessId}/service")]
        public async Task<IActionResult> AddMyService(string businessId, AddServiceDto newServiceDto)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var service = await _businessService.AddServiceToMyBusiness(ownerId, businessId, newServiceDto);

                return Ok(service);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpPatch("me/{businessId}/service")]
        public async Task<IActionResult> EditMyService(string businessId, [FromBody] EditServiceDto editServiceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var service = await _businessService.EditMyService(ownerId, businessId, editServiceDto);

                return Ok(service);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpDelete("me/{businessId}/service/{serviceId}")]
        public async Task<IActionResult> DeleteMyService(string businessId, string serviceId)
        {

            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                await _businessService.DeleteMyService(ownerId, businessId, serviceId);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Service not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpPatch("me/{businessId}")]
        public async Task<IActionResult> EditMyBusiness(string businessId, [FromBody] PatchBusinessDto editedBusiness)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var business = await _businessService.PatchBusiness(ownerId, businessId, editedBusiness);

                return Ok(business);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpPatch("me/{businessId}/photo")]
        public async Task<IActionResult> EditMyPhoto(string businessId, [FromForm] BusinessPhotoForm photo)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var business = await _businessService.PatchPhoto(ownerId, businessId, photo);

                return Ok(new
                {
                    logoUrl = business.LogoUrl,
                    profilePictureUrl = business.ProfilePictureUrl,
                    businessPhotos = business.BusinessPhotos
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new {
                        p.Id,
                        p.ImageUrl,
                        p.Type
                    })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpDelete("me/{businessId}/photo")]
        public async Task<IActionResult> DeleteMyPhoto(string businessId, [FromQuery] string type, [FromQuery] Guid? photoId)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized(new { error = "User is not logged in" });

            if (type == null)
                return BadRequest(new { error = "Query 'type' is missing." });

            try
            {
                await _businessService.RemovePhoto(ownerId, businessId, type, photoId);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Owner")]
        [HttpPatch("me/{businessId}/opening-hours")]
        public async Task<IActionResult> UpdateOpeningHours(string businessId, [FromBody] List<OpeningHourDto> hours)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();

            try
            {
                var updated = await _businessService.UpdateOpeningHours(ownerId, businessId, hours);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("me/{businessId}/employees")]
        public async Task<IActionResult> AddNewEmployee(string businessId, [FromBody] AddEmployeeDto newEmployee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager))
                    return Unauthorized();


                var employee = await _businessService.AddNewEmployee(businessId, newEmployee);
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPatch("me/{businessId}/employees/{employeeId}")]
        public async Task<IActionResult> PatchBusinessEmployeeById(string businessId, string employeeId, [FromBody] UpdateEmployeeDto editEmployee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                var isOwnProfile = await _businessService.IsEditingOwnProfile(currentUserId, employeeId, businessId); //Check if user is editing his own profile
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager) && isOwnProfile == false) //Let edit only if Owner/Manager or own profile
                    return Unauthorized();

                var employee = await _businessService.PatchBusinessEmployeeById(businessId, employeeId, editEmployee);
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me/{businessId}/employees")]
        public async Task<IActionResult> GetBusinessEmployees(string businessId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole == null) //Let any employee get data
                    return Unauthorized();


                var employees = await _businessService.GetBusinessEmployees(businessId);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me/{businessId}/employees/{employeeId}")]
        public async Task<IActionResult> GetBusinessEmployeeById(string businessId, string employeeId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole == null) //Let any employee get data
                    return Unauthorized();

                var employees = await _businessService.GetBusinessEmployeeById(businessId, employeeId);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("me/{businessId}/employees/{employeeId}/avatar")]
        public async Task<IActionResult> PutNewEmployeeAvatar(string businessId, string employeeId, [FromForm] EmployeeAvatarForm employeeAvatar)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                var isOwnProfile = await _businessService.IsEditingOwnProfile(currentUserId, employeeId, businessId); //Check if user is editing his own profile
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager) && isOwnProfile == false) //Let edit only if Owner/Manager or own profile
                    return Unauthorized();

                var imageUrl = await _businessService.PutEmployeePhoto(employeeId, employeeAvatar.AvatarFile);

                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("me/{businessId}/employees/{employeeId}/avatar")]
        public async Task<IActionResult> DeleteEmployeeAvatar(string businessId, string employeeId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                var isOwnProfile = await _businessService.IsEditingOwnProfile(currentUserId, employeeId, businessId); //Check if user is editing his own profile
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager) && isOwnProfile == false) //Let edit only if Owner/Manager or own profile
                    return Unauthorized();

                await _businessService.DeleteEmployeePhoto(employeeId);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("me/{businessId}/employees/{employeeId}/services")]
        public async Task<IActionResult> AssignServicesToEmployee(string businessId, string employeeId, [FromBody] AssignEmployeeServicesDto dto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                var isOwnProfile = await _businessService.IsEditingOwnProfile(currentUserId, employeeId, businessId); //Check if user is editing his own profile
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager) && isOwnProfile == false) //Let edit only if Owner/Manager or own profile
                    return Unauthorized();

                await _businessService.AssignServicesToEmployee(employeeId, businessId, dto.ServiceIds);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
