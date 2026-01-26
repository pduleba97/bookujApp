using BookujApi.Enums;
using BookujApi.Models;
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
                string? publicUrl = null;
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

        [Authorize]
        [HttpGet("me/{businessId}/services/category/{categoryId}")]
        public async Task<IActionResult> GetServicesFromCategory(string businessId, Guid categoryId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (currentUserId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is null) //Allow access for any employee of the business
                    return Forbid();

                var services = await _businessService.GetServicesFromCategory(businessId, categoryId);

                return Ok(services);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("me/{businessId}/services/nocategory")]
        public async Task<IActionResult> GetServicesWithoutCategory(string businessId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (currentUserId == null)
                    return Unauthorized(new { error = "User is not logged in" });

                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is null) //Allow access for any employee of the business
                    return Forbid();

                var servicesWithoutCategory = await _businessService.GetServicesWithoutCategory(businessId);

                return Ok(servicesWithoutCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("me/{businessId}/service")]
        public async Task<IActionResult> AddMyService(string businessId, AddServiceDto newServiceDto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let add new service only if Owner/Manager
                    return Forbid();

                var service = await _businessService.AddServiceToMyBusiness(businessId, newServiceDto);

                return Ok(service);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPatch("me/{businessId}/service/{serviceId}")]
        public async Task<IActionResult> EditMyService(string businessId, Guid serviceId, [FromBody] EditServiceDto editServiceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let edit service only if Owner/Manager
                    return Forbid();

                var service = await _businessService.EditMyService(businessId, serviceId, editServiceDto);

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

        [Authorize]
        [HttpPost("me/{businessId}/servicecategory")]
        public async Task<IActionResult> AddServiceCategory(string businessId, [FromBody] AddServiceCategoryDto newServiceCategory)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let add new service category only if Owner/Manager
                    return Forbid();

                var serviceCategory = await _businessService.AddServiceCategory(businessId, newServiceCategory);

                return Ok(serviceCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me/{businessId}/servicecategories")]
        public async Task<IActionResult> GetServiceCategories(string businessId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is null) //Let fetch service categories for all employees
                    return Forbid();

                var serviceCategories = await _businessService.GetServiceCategories(businessId);

                return Ok(serviceCategories);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("me/{businessId}/servicecategory/{serviceCategoryId}")]
        public async Task<IActionResult> EditServiceCategory(string businessId, Guid serviceCategoryId, [FromBody] EditServiceDto editedServiceCategory)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let edit service category only if Owner/Manager
                    return Forbid();

                var serviceCategory = await _businessService.EditServiceCategory(businessId, serviceCategoryId, editedServiceCategory);

                return Ok(serviceCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("me/{businessId}/ReorderCategory/{currentElementId}")]
        public async Task<IActionResult> ReorderCategory(string businessId, Guid currentElementId, [FromQuery] Guid? prevId, [FromQuery] Guid? nextId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let reorder service category only if Owner/Manager
                    return Forbid();

                var serviceCategory = await _businessService.ReorderAsync<ServiceCategory>(businessId, currentElementId, prevId, nextId);

                return Ok(serviceCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("me/{businessId}/servicecategory/{serviceCategoryId}")]
        public async Task<IActionResult> DeleteServiceCategory(string businessId, Guid serviceCategoryId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let delete service category only if Owner/Manager
                    return Forbid();

                await _businessService.DeleteServiceCategory(businessId, serviceCategoryId);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me/{businessId}/employees/{employeeId}/services-grouped")]
        public async Task<IActionResult> GetEmployeeServicesGroupedByCategory(string businessId, Guid employeeId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is null) //Let all employees to fetch given employee services grouped by category.
                    return Forbid();

                var employeeServicesGroupedByCAtegory = await _businessService.GetEmployeeServicesGroupedByCategory(businessId, employeeId);

                return Ok(employeeServicesGroupedByCAtegory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
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
                    .Select(p => new
                    {
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
                    return Forbid();


                var employee = await _businessService.AddNewEmployee(businessId, newEmployee);
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("me/{businessId}/employees/{employeeId}")]
        public async Task<IActionResult> DeleteEmployee(string businessId, string employeeId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager))
                    return Forbid();

                await _businessService.DeleteEmployee(businessId, employeeId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { error = ex.Message });
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
        [HttpPut("me/{businessId}/ReorderEmployee/{currentElementId}")]
        public async Task<IActionResult> ReorderEmployee(string businessId, Guid currentElementId, [FromQuery] Guid? prevId, [FromQuery] Guid? nextId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized(new { error = "User is not logged in" });

            try
            {
                var currentUserRole = await _businessService.CheckEmployeeRole(currentUserId, businessId);
                if (currentUserRole is not (BusinessRole.Owner or BusinessRole.Manager)) //Let reorder employee only if Owner/Manager
                    return Forbid();

                var employee = await _businessService.ReorderAsync<Employee>(businessId, currentElementId, prevId, nextId);

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
            if (employeeAvatar.AvatarFile == null)
                return BadRequest("Avatar file cannot be null");

            if (employeeAvatar.AvatarFile.Length == 0)
                return BadRequest("Avatar file is empty");

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
