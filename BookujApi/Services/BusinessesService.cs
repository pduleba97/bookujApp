using BookujApi.Data;
using BookujApi.Enums;
using BookujApi.Models;
using BookujApi.Models.Dto;
using BookujApi.Models.Forms;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;
using static BookujApi.Models.Dto.GetBusinessDto;
using static BookujApi.Models.Dto.GetEmployeeDto;

namespace BookujApi.Services
{
    public class BusinessesService
    {
        private readonly AppDbContext _db;
        private readonly Supabase.Client _cdn;
        private readonly UserService _userService;

        public BusinessesService(AppDbContext db, Supabase.Client cdn, UserService userService)
        {
            _db = db;
            _cdn = cdn;
            _userService = userService;
        }

        public async Task<BusinessReadDto> AddNewBusinessToOwner(string? ownerId, BusinessDto business, string? publicUrl)
        {
            Guid parseOwnerID;
            if (string.IsNullOrEmpty(ownerId) || !Guid.TryParse(ownerId, out parseOwnerID))
                throw new ArgumentException("Invalid ownerId");

            var userExists = await _db.Users.SingleOrDefaultAsync(u => u.Id == parseOwnerID);
            if (userExists == null)
                throw new KeyNotFoundException("User is not found");

            var newBusiness = new Business
            {
                Id = Guid.NewGuid(),
                OwnerId = parseOwnerID,
                Name = business.Name,
                Description = business.Description,
                Category = business.Category,
                Email = business.Email,
                PhoneNumber = business.PhoneNumber,
                Address = business.Address,
                City = business.City,
                PostalCode = business.PostalCode,
                IsActive = false,
                ProfilePictureUrl = publicUrl,
                CreatedAt = DateTime.UtcNow,
            };

            _db.Businesses.Add(newBusiness);

            var ownerEmployee = new Employee
            {
                Id = Guid.NewGuid(),
                BusinessId = newBusiness.Id,
                FirstName = userExists.FirstName,
                LastName = userExists.LastName,
                UserId = userExists.Id,
                Role = BusinessRole.Owner,
                CreatedAt = DateTime.UtcNow
            };

            _db.Employees.Add(ownerEmployee);

            foreach (var openingHour in business.OpeningHours)
            {
                _db.OpeningHours.Add(new OpeningHour
                {
                    Id = Guid.NewGuid(),
                    BusinessId = newBusiness.Id,
                    DayOfWeek = openingHour.DayOfWeek,
                    IsOpen = openingHour.IsOpen,
                    OpenTime = openingHour.OpenTime,
                    CloseTime = openingHour.CloseTime
                });
            }


            foreach (var service in business.Services)
            {
                _db.Services.Add(new Service
                {
                    Id = Guid.NewGuid(),
                    BusinessId = newBusiness.Id,
                    Name = service.Name,
                    Description = service.Description,
                    Price = service.Price,
                    DurationMinutes = service.DurationMinutes,
                    IsActive = service.IsActive,
                });
            }


            await _db.SaveChangesAsync();

            return new BusinessReadDto
            {
                Id = newBusiness.Id,
                OwnerId = newBusiness.OwnerId,
                Name = newBusiness.Name,
                Description = newBusiness.Description,
                Category = newBusiness.Category,
                Email = newBusiness.Email,
                PhoneNumber = newBusiness.PhoneNumber,
                Address = newBusiness.Address,
                City = newBusiness.City,
                PostalCode = newBusiness.PostalCode,
                IsActive = newBusiness.IsActive,
                ProfilePictureUrl = newBusiness.ProfilePictureUrl,
                LogoUrl = newBusiness.LogoUrl,
                CreatedAt = newBusiness.CreatedAt,
            };
        }

        public async Task<string> UploadBusinessPicture(IFormFile file, string folder)
        {
            await _cdn.InitializeAsync();

            var storage = _cdn.Storage;

            string sanitizedFileName = Regex.Replace(file.FileName.Normalize(NormalizationForm.FormD), @"\p{Mn}", "");

            sanitizedFileName = Regex.Replace(sanitizedFileName, @"[^a-zA-Z0-9_.-]", "");

            string fileName = $"{Guid.NewGuid()}_{sanitizedFileName}";

            string path = $"{folder}/{fileName}";

            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            await storage.From("business-images").Upload(fileBytes, path);

            string publicUrl = storage.From("business-images").GetPublicUrl(path);
            Console.WriteLine($"[INFO] Uploaded file to path={path}, publicUrl={publicUrl}");

            return publicUrl;
        }

        public async Task RemoveBusinessPicture(string? oldUrl, string folder)
        {
            await _cdn.InitializeAsync();

            var storage = _cdn.Storage;

            if (!string.IsNullOrEmpty(oldUrl))
            {
                var oldFileName = oldUrl.Split('/').Last();
                string path = $"{folder}/{oldFileName}";
                try
                {
                    await storage.From("business-images").Remove(path);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[WARN] Failed to delete old business picture: {ex.Message}");
                }
            }
        }

        public async Task<List<BusinessListItemDto>> GetAllOwnersBusinessesToList(string? ownerId)
        {
            Guid parseOwnerID;
            if (!Guid.TryParse(ownerId, out parseOwnerID))
                throw new Exception("Failed to parse userId to Guid");

            List<BusinessListItemDto> businessesDtoList = await _db.Businesses.Where(b => b.OwnerId == parseOwnerID).Select(b => new BusinessListItemDto
            {
                Id = b.Id,
                Name = b.Name,
                Category = b.Category,
                Address = b.Address,
                City = b.City,
                PostalCode = b.PostalCode,
                IsActive = b.IsActive
            }).ToListAsync();

            return businessesDtoList;
        }

        public async Task<GetBusinessDto?> GetOwnersBusiness(string? ownerId, string businessId)
        {
            if (ownerId == null)
                return null;

            Guid parseOwnerID;
            if (!Guid.TryParse(ownerId, out parseOwnerID))
                return null;

            Guid parseBusinessID;
            if (!Guid.TryParse(businessId, out parseBusinessID))
                return null;

            var business = await _db.Businesses
                .Include(b => b.Owner)
                .Include(b => b.OpeningHours.OrderBy(h => h.DayOfWeek))
                .Include(b => b.Services)
                .Include(b => b.BusinessPhotos)
                .Include(b => b.Employees.Where(e => !e.IsDeleted && e.IsActive && e.Role != BusinessRole.Receptionist))
                .FirstOrDefaultAsync(b => b.OwnerId == parseOwnerID && b.Id == parseBusinessID);

            if (business == null)
                return null;

            return new GetBusinessDto
            {
                Id = business.Id,
                Name = business.Name,
                Description = business.Description,
                Category = business.Category,
                Email = business.Email,
                PhoneNumber = business.PhoneNumber,
                Address = business.Address,
                City = business.City,
                PostalCode = business.PostalCode,
                IsActive = business.IsActive,
                ProfilePictureUrl = business.ProfilePictureUrl,
                LogoUrl = business.LogoUrl,
                InstagramUrl = business.InstagramUrl,
                FacebookUrl = business.FacebookUrl,
                WebsiteUrl = business.WebsiteUrl,
                CreatedAt = business.CreatedAt,
                OpeningHours = business.OpeningHours?
            .Select(h => new GetOpeningHourDto
            {
                Id = h.Id,
                DayOfWeek = h.DayOfWeek,
                IsOpen = h.IsOpen,
                OpenTime = h.OpenTime,
                CloseTime = h.CloseTime
            }).ToList() ?? new List<GetOpeningHourDto>(),
                Services = business.Services?
                .OrderBy(s => s.CreatedAt)
                .Select(s => new GetServiceDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes,
                    IsActive = s.IsActive
                }).ToList() ?? new List<GetServiceDto>(),
                BusinessPhotos = business.BusinessPhotos?
                .OrderByDescending(bp => bp.CreatedAt)
                .Select(bp => new GetBusinessPhoto
                {
                    Id = bp.Id,
                    ImageUrl = bp.ImageUrl,
                    Type = bp.Type,
                    SortOrder = bp.SortOrder,
                }).ToList() ?? new List<GetBusinessPhoto>(),
                Employees = business.Employees?
                .OrderBy(e => e.Role)
                .ThenBy(e => e.CreatedAt)
                .Select(e => new GetBusinessEmployeeDto
                {
                    Id = e.Id,
                    Role = e.Role,
                    Position = e.Position,
                    Description = e.Description,
                    IsActive = e.IsActive,
                    FirstName = e.FirstName,
                    ImageUrl = e.ImageUrl,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt
                }).ToList() ?? new List<GetBusinessEmployeeDto>(),
                Owner = new UserDto
                {
                    FirstName = business.Owner.FirstName,
                    LastName = business.Owner.LastName,
                    Email = business.Owner.Email,
                }
            };
        }

        public async Task<BusinessReadDto> RemoveOwnersBusinessById(string ownerId, string businessId)
        {
            Guid parseOwnerId;
            if (!Guid.TryParse(ownerId, out parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var bussinessToRemove = await _db.Businesses.FirstOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);

            if (bussinessToRemove == null)
            {
                throw new InvalidOperationException("Business not found or you don't have permission to remove it.");
            }

            await RemoveBusinessPicture(bussinessToRemove.ProfilePictureUrl, "profile-pictures");
            await RemoveBusinessPicture(bussinessToRemove.LogoUrl, "logos");

            _db.Businesses.Remove(bussinessToRemove);
            await _db.SaveChangesAsync();

            //IMPLEMENT REMOVING OTHER PHOTOS AS WELL!!! ALSO PICTURES TABLE SHOULD BE CLEARED OUT OF BUSINESS PICTURES TBD!!!

            return new BusinessReadDto
            {
                Id = bussinessToRemove.Id,
                OwnerId = bussinessToRemove.OwnerId,
                Name = bussinessToRemove.Name,
                Description = bussinessToRemove.Description,
                Category = bussinessToRemove.Category,
                Email = bussinessToRemove.Email,
                PhoneNumber = bussinessToRemove.PhoneNumber,
                Address = bussinessToRemove.Address,
                City = bussinessToRemove.City,
                PostalCode = bussinessToRemove.PostalCode,
                Latitude = bussinessToRemove.Latitude,
                Longitude = bussinessToRemove.Longitude,
                IsActive = bussinessToRemove.IsActive,
                ProfilePictureUrl = bussinessToRemove.ProfilePictureUrl,
                CreatedAt = bussinessToRemove.CreatedAt
            };
        }

        public async Task<List<ServiceDto>> GetServicesFromMyBusiness(string ownerId, string businessId)
        {
            Guid parseOwnerId;
            if (!Guid.TryParse(ownerId, out parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var business = await _db.Businesses.SingleOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);

            if (business == null)
                throw new UnauthorizedAccessException("This business does not belong to you.");

            List<ServiceDto> servicesList = await _db.Services.Where(s => s.BusinessId == parseBusinessId).OrderBy(s => s.CreatedAt).Select(s => new ServiceDto
            {
                Id = s.Id,
                BusinessId = s.BusinessId,
                ServiceCategoryId = s.ServiceCategoryId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive
            })
            .ToListAsync();

            return servicesList;
        }

        public async Task<List<ServiceDto>> GetServicesFromCategory(string businessId, Guid categoryId)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            List<ServiceDto> servicesList = await _db.Services.AsNoTracking().Where(s => s.BusinessId == parseBusinessId && s.ServiceCategoryId == categoryId).OrderBy(s => s.CreatedAt).Select(s => new ServiceDto
            {
                Id = s.Id,
                BusinessId = s.BusinessId,
                ServiceCategoryId = s.ServiceCategoryId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive
            })
            .ToListAsync();

            return servicesList;
        }

        public async Task<List<ServiceDto>> GetServicesWithoutCategory(string businessId)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            List<ServiceDto> servicesList = await _db.Services.AsNoTracking().Where(s => s.BusinessId == parseBusinessId && s.ServiceCategoryId == null).OrderBy(s => s.CreatedAt).Select(s => new ServiceDto
            {
                Id = s.Id,
                BusinessId = s.BusinessId,
                ServiceCategoryId = s.ServiceCategoryId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive
            })
            .ToListAsync();

            return servicesList;
        }


        public async Task<ServiceDto> AddServiceToMyBusiness(string businessId, AddServiceDto newServiceDto)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            if (!await _db.Businesses.AnyAsync(b => b.Id == parseBusinessId))
                throw new KeyNotFoundException("Business not found.");

            if (newServiceDto.ServiceCategoryId != null) //Protection against Service Category from a different business
            {
                var categoryExists = await _db.ServiceCategories.AnyAsync(sc =>
                    sc.Id == newServiceDto.ServiceCategoryId &&
                    sc.BusinessId == parseBusinessId);

                if (!categoryExists)
                    throw new ArgumentException("Invalid service category");
            }

            var newService = new Service
            {
                Id = Guid.NewGuid(),
                BusinessId = parseBusinessId,
                ServiceCategoryId = newServiceDto.ServiceCategoryId,
                Name = newServiceDto.Name,
                Description = newServiceDto.Description,
                Price = newServiceDto.Price,
                DurationMinutes = newServiceDto.DurationMinutes,
                IsActive = newServiceDto.IsActive,
            };

            _db.Services.Add(newService);

            await _db.SaveChangesAsync();

            return new ServiceDto
            {
                Id = newService.Id,
                BusinessId = newService.BusinessId,
                ServiceCategoryId = newService.ServiceCategoryId,
                Name = newService.Name,
                Description = newService.Description,
                Price = newService.Price,
                DurationMinutes = newService.DurationMinutes,
                IsActive = newService.IsActive,
            };
        }

        public async Task<ServiceDto> EditMyService(string businessId, Guid serviceId, EditServiceDto editServiceDto)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            if (!await _db.Businesses.AnyAsync(b => b.Id == parseBusinessId))
                throw new KeyNotFoundException("Business not found.");

            var service = await _db.Services.SingleOrDefaultAsync(s => s.Id == serviceId && s.BusinessId == parseBusinessId);

            if (service == null)
                throw new KeyNotFoundException("Service not found.");

            if (editServiceDto.ServiceCategoryId != null)
            {
                if (!await _db.ServiceCategories.AnyAsync(sc =>
                sc.Id == editServiceDto.ServiceCategoryId &&
                sc.BusinessId == parseBusinessId))
                    throw new ArgumentException("Invalid service category");

                service.ServiceCategoryId = editServiceDto.ServiceCategoryId;
            }

            if (editServiceDto.Name != null)
                service.Name = editServiceDto.Name;

            if (editServiceDto.Description != null)
                service.Description = editServiceDto.Description;

            if (editServiceDto.Price != null)
            {
                if (editServiceDto.Price < 0)
                    throw new ArgumentException("Price must be greater than zero.");

                service.Price = editServiceDto.Price.Value;
            }


            if (editServiceDto.DurationMinutes != null)
            {
                if (editServiceDto.DurationMinutes <= 0)
                    throw new ArgumentException("Duration must be greater than zero.");

                service.DurationMinutes = editServiceDto.DurationMinutes.Value;
            }

            if (editServiceDto.IsActive != null)
                service.IsActive = editServiceDto.IsActive.Value;

            await _db.SaveChangesAsync();

            return new ServiceDto
            {
                Id = service.Id,
                BusinessId = service.BusinessId,
                ServiceCategoryId = service.ServiceCategoryId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes,
                IsActive = service.IsActive,
            };
        }

        public async Task DeleteMyService(string ownerId, string businessId, string serviceId)
        {
            Guid parseOwnerId;
            if (!Guid.TryParse(ownerId, out parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            Guid parseServiceId;
            if (!Guid.TryParse(serviceId, out parseServiceId))
                throw new ArgumentException("Invalid serviceId");

            var business = await _db.Businesses.SingleOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);

            if (business == null)
                throw new UnauthorizedAccessException("This business does not belong to you.");

            var service = await _db.Services.SingleOrDefaultAsync(s => s.Id == parseServiceId && s.BusinessId == parseBusinessId);

            if (service == null)
                throw new Exception("Service not found.");

            _db.Services.Remove(service);

            await _db.SaveChangesAsync();
        }

        public async Task<ServiceCategoryDto> AddServiceCategory(string businessId, AddServiceCategoryDto newServiceCategory)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            if (!await _db.Businesses.AnyAsync(b => b.Id == parseBusinessId))
                throw new KeyNotFoundException("Business not found.");

            var serviceCategory = new ServiceCategory
            {
                Id = Guid.NewGuid(),
                BusinessId = parseBusinessId,
                Name = newServiceCategory.Name,
                Description = newServiceCategory.Description,
                CreatedAt = DateTime.UtcNow
            };

            _db.ServiceCategories.Add(serviceCategory);

            await _db.SaveChangesAsync();

            return new ServiceCategoryDto
            {
                Id = serviceCategory.Id,
                BusinessId = serviceCategory.BusinessId,
                Name = serviceCategory.Name,
                Description = serviceCategory.Description,
            };
        }

        public async Task<List<ServiceCategoryDto>> GetServiceCategories(string businessId)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var serviceCategoriesList = await _db.ServiceCategories.Where(sc => sc.BusinessId == parseBusinessId).OrderBy(sc => sc.CreatedAt).ToListAsync();

            return serviceCategoriesList.Select(sc => new ServiceCategoryDto
            {
                Id = sc.Id,
                Name = sc.Name,
                Description = sc.Description
            }).ToList();
        }

        public async Task<ServiceCategoryDto> EditServiceCategory(string businessId, Guid serviceCategoryId, EditServiceDto editedServiceCategory)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var serviceCategory = await _db.ServiceCategories.SingleOrDefaultAsync(s => s.Id == serviceCategoryId && s.BusinessId == parseBusinessId);

            if (serviceCategory == null)
                throw new KeyNotFoundException("Service category not found.");

            if (editedServiceCategory.Name != null)
                serviceCategory.Name = editedServiceCategory.Name;

            if (editedServiceCategory.Description != null)
                serviceCategory.Description = editedServiceCategory.Description;

            serviceCategory.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return new ServiceCategoryDto
            {
                Id = serviceCategory.Id,
                BusinessId = serviceCategory.BusinessId,
                Name = serviceCategory.Name,
                Description = serviceCategory.Description,
                CreatedAt = serviceCategory.CreatedAt,
                UpdatedAt = serviceCategory.UpdatedAt,
            };
        }

        public async Task DeleteServiceCategory(string businessId, Guid serviceCategoryId)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var serviceCategory = await _db.ServiceCategories.SingleOrDefaultAsync(sc => sc.Id == serviceCategoryId && sc.BusinessId == parseBusinessId);

            if (serviceCategory == null)
            {
                throw new KeyNotFoundException("Service category not found.");
            }

            _db.ServiceCategories.Remove(serviceCategory);
            await _db.SaveChangesAsync();
        }

        public async Task<List<GetEmployeeServicesGroupedByCategoryDto>> GetEmployeeServicesGroupedByCategory(string businessId, Guid employeeId)
        {
            Guid parseBusinessId;
            if (!Guid.TryParse(businessId, out parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var employeeServicesGroupedByCategory = await _db.EmployeeServices
                .Where(es => es.EmployeeId == employeeId && es.Service.BusinessId == parseBusinessId)
                .Include(es => es.Service)
                    .ThenInclude(s => s.ServiceCategory)
                .AsNoTracking()
                .ToListAsync();

            return employeeServicesGroupedByCategory.Select(es => es.Service)
                .GroupBy(s => s.ServiceCategory?.Id)
                .Select(g => new GetEmployeeServicesGroupedByCategoryDto
                {
                    CategoryId = g.Key,
                    CategoryName = g.First().ServiceCategory?.Name ?? "Uncategorized",
                    Services = g.Select(s => new ServiceDto
                    {
                        Id = s.Id,
                        BusinessId = s.BusinessId,
                        Name = s.Name,
                        Description = s.Description,
                        DurationMinutes = s.DurationMinutes,
                        Price = s.Price,
                    }).ToList()
                })
                .ToList();
        }

        public async Task<Business> PatchBusiness(string ownerId, string businessId, PatchBusinessDto patchBusinessDto)
        {
            if (!Guid.TryParse(ownerId, out Guid parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var business = await _db.Businesses
                .SingleOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);

            if (business == null)
                throw new UnauthorizedAccessException("This business does not belong to you.");


            if (patchBusinessDto.Name != null)
            {
                if (patchBusinessDto.Name.Length < 3 || patchBusinessDto.Name.Length > 80)
                    throw new ArgumentException("Name must be between 3 and 80 characters.");
                business.Name = patchBusinessDto.Name;
            }

            if (patchBusinessDto.Description != null)
            {
                if (patchBusinessDto.Description.Length > 500)
                    throw new ArgumentException("Description cannot exceed 500 characters.");
                business.Description = patchBusinessDto.Description;
            }

            if (patchBusinessDto.Category != null)
            {
                if (patchBusinessDto.Category.Length > 80)
                    throw new ArgumentException("Category cannot exceed 80 characters.");
                business.Category = patchBusinessDto.Category;
            }

            if (patchBusinessDto.Email != null)
            {
                if (!IsValidEmail(patchBusinessDto.Email))
                    throw new ArgumentException("Invalid email format.");
                business.Email = patchBusinessDto.Email;
            }

            if (patchBusinessDto.PhoneNumber != null)
            {
                if (!Regex.IsMatch(patchBusinessDto.PhoneNumber, @"^\+?[0-9\s\-]{7,15}$"))
                    throw new ArgumentException("Invalid phone number format.");

                business.PhoneNumber = patchBusinessDto.PhoneNumber;
            }

            if (patchBusinessDto.Address != null)
            {
                if (patchBusinessDto.Address.Length < 3 || patchBusinessDto.Address.Length > 120)
                    throw new ArgumentException("Address must be between 3 and 120 characters.");
                business.Address = patchBusinessDto.Address;
            }

            if (patchBusinessDto.City != null)
            {
                if (patchBusinessDto.City.Length < 2 || patchBusinessDto.City.Length > 60 ||
                    !Regex.IsMatch(patchBusinessDto.City, @"^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ\s\-]+$"))
                    throw new ArgumentException("Invalid city name.");
                business.City = patchBusinessDto.City;
            }

            if (patchBusinessDto.PostalCode != null)
            {
                if (!Regex.IsMatch(patchBusinessDto.PostalCode, @"^[\w\s\-]{3,10}$"))
                    throw new ArgumentException("Invalid postal code format.");
                business.PostalCode = patchBusinessDto.PostalCode;
            }

            if (patchBusinessDto.Latitude.HasValue)
            {
                if (patchBusinessDto.Latitude < -90 || patchBusinessDto.Latitude > 90)
                    throw new ArgumentException("Latitude must be between -90 and 90.");
                business.Latitude = patchBusinessDto.Latitude.Value;
            }

            if (patchBusinessDto.Longitude.HasValue)
            {
                if (patchBusinessDto.Longitude < -180 || patchBusinessDto.Longitude > 180)
                    throw new ArgumentException("Longitude must be between -180 and 180.");
                business.Longitude = patchBusinessDto.Longitude.Value;
            }

            if (patchBusinessDto.IsActive.HasValue)
                business.IsActive = patchBusinessDto.IsActive.Value;

            if (patchBusinessDto.InstagramUrl != null)
            {
                if (patchBusinessDto.InstagramUrl.Length > 500)
                    throw new ArgumentException("Instagram URL cannot exceed 500 characters.");
                business.InstagramUrl = patchBusinessDto.InstagramUrl;
            }

            if (patchBusinessDto.FacebookUrl != null)
            {
                if (patchBusinessDto.FacebookUrl.Length > 500)
                    throw new ArgumentException("Facebook URL cannot exceed 500 characters.");
                business.FacebookUrl = patchBusinessDto.FacebookUrl;
            }

            if (patchBusinessDto.WebsiteUrl != null)
            {
                if (patchBusinessDto.WebsiteUrl.Length > 500)
                    throw new ArgumentException("WebsiteUrl URL cannot exceed 500 characters.");
                business.WebsiteUrl = patchBusinessDto.WebsiteUrl;
            }

            business.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return business;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public async Task<Business> PatchPhoto(string ownerId, string businessId, BusinessPhotoForm photo)
        {
            if (!Guid.TryParse(ownerId, out Guid parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var business = await _db.Businesses
                .Include(b => b.BusinessPhotos)
                .SingleOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);

            if (business == null)
                throw new UnauthorizedAccessException("This business does not belong to you.");

            string? newProfileUrl = null;
            string? newLogoUrl = null;
            string? newGalleryPhotoUrl = null;

            if (photo.ProfilePictureFile != null)
            {
                newProfileUrl = await UploadBusinessPicture(photo.ProfilePictureFile, "profile-pictures");

                if (business.ProfilePictureUrl != null)
                    await RemoveBusinessPicture(business.ProfilePictureUrl, "profile-pictures");

                business.ProfilePictureUrl = newProfileUrl;
                business.UpdatedAt = DateTime.UtcNow;
            }

            if (photo.LogoFile != null)
            {
                newLogoUrl = await UploadBusinessPicture(photo.LogoFile, "logos");

                if (business.LogoUrl != null)
                    await RemoveBusinessPicture(business.LogoUrl, "logos");
                business.LogoUrl = newLogoUrl;
                business.UpdatedAt = DateTime.UtcNow;
            }

            if (photo.GalleryFile != null)
            {
                newGalleryPhotoUrl = await UploadBusinessPicture(photo.GalleryFile, "gallery");

                var newGalleryPhoto = new BusinessPhoto
                {
                    Id = Guid.NewGuid(),
                    BusinessId = business.Id,
                    ImageUrl = newGalleryPhotoUrl,
                    Type = BusinessPhotoType.Other,
                    CreatedAt = DateTime.UtcNow
                };

                _db.BusinessPhotos.Add(newGalleryPhoto);
            }


            await _db.SaveChangesAsync();

            return business;
        }

        public async Task RemovePhoto(string ownerId, string businessId, string type, Guid? photoId = null)
        {
            var allowedTypes = new[] { "logo", "profilePicture", "gallery" };
            if (!allowedTypes.Contains(type))
                throw new ArgumentException("Invalid type");


            if (!Guid.TryParse(ownerId, out Guid parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var business = await _db.Businesses
                .SingleOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);

            if (business == null)
                throw new UnauthorizedAccessException("This business does not belong to you.");

            switch (type)
            {
                case "profilePicture":
                    if (business.ProfilePictureUrl != null)
                        await RemoveBusinessPicture(business.ProfilePictureUrl, "profile-pictures");

                    business.ProfilePictureUrl = null;
                    business.UpdatedAt = DateTime.UtcNow;
                    break;
                case "logo":
                    if (business.LogoUrl != null)
                        await RemoveBusinessPicture(business.LogoUrl, "logos");

                    business.LogoUrl = null;
                    business.UpdatedAt = DateTime.UtcNow;
                    break;
                case "gallery":
                    if (photoId == null)
                        throw new ArgumentException("photoId is required for gallery photos");

                    var photo = await _db.BusinessPhotos.SingleOrDefaultAsync(bp => bp.Id == photoId && bp.BusinessId == parseBusinessId);
                    if (photo == null)
                        throw new UnauthorizedAccessException("This photo does not belong to your business.");

                    await RemoveBusinessPicture(photo.ImageUrl, "gallery");
                    _db.BusinessPhotos.Remove(photo);
                    business.UpdatedAt = DateTime.UtcNow;
                    break;
            }

            await _db.SaveChangesAsync();
        }

        public async Task<List<OpeningHourDto>> UpdateOpeningHours(string ownerId, string businessId, List<OpeningHourDto> hours)
        {
            if (!Guid.TryParse(ownerId, out Guid parseOwnerId))
                throw new ArgumentException("Invalid ownerId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var business = await _db.Businesses.FirstOrDefaultAsync(b => b.Id == parseBusinessId && b.OwnerId == parseOwnerId);
            if (business == null)
                throw new UnauthorizedAccessException("Business not found or not yours");


            var openingHours = await _db.OpeningHours
                .Where(o => o.BusinessId == parseBusinessId)
                .ToListAsync();

            foreach (var dto in hours)
            {
                var oh = openingHours.FirstOrDefault(o => o.DayOfWeek == dto.DayOfWeek);

                if (oh != null)
                {
                    oh.IsOpen = dto.IsOpen;
                    if (dto.IsOpen == true)
                    {
                        if (dto.OpenTime == null || dto.CloseTime == null)
                            throw new ArgumentException("OpenTime or CloseTime is missing");

                        if (dto.OpenTime >= dto.CloseTime)
                            throw new ArgumentException("OpenTime cannot be greater or equal CloseTime");

                        oh.OpenTime = dto.OpenTime;
                        oh.CloseTime = dto.CloseTime;
                    }

                    oh.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _db.SaveChangesAsync();
            return openingHours.Select(oh => new OpeningHourDto
            {
                Id = oh.Id,
                DayOfWeek = oh.DayOfWeek,
                IsOpen = oh.IsOpen,
                OpenTime = oh.OpenTime,
                CloseTime = oh.CloseTime,
            }).OrderBy(oh => oh.DayOfWeek).ToList();
        }

        public async Task<GetEmployeeDto> AddNewEmployee(string businessId, AddEmployeeDto newEmployee)
        {
            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");
            Employee employee;
            Models.User? user = null;
            Models.User? existing = null;
            bool shouldAdd = false;

            if (newEmployee.Email != null)
            {
                var normalizedEmail = newEmployee.Email.ToLowerInvariant();
                existing = await _db.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail);
                if (existing == null)
                {
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456"); //TODO: default password - in the future a random password should be generated and a user should receive an email to reset the password.

                    user = new Models.User
                    {
                        Id = Guid.NewGuid(),
                        FirstName = newEmployee.FirstName,
                        LastName = newEmployee.LastName,
                        Email = newEmployee.Email.ToLowerInvariant(),
                        PhoneNumber = newEmployee.PhoneNumber,
                        PasswordHash = hashedPassword,
                        Role = UserRole.Client,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _db.Users.Add(user);

                    employee = new Employee
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        BusinessId = parseBusinessId,
                        Role = newEmployee.Role,
                        Position = newEmployee.Position,
                        Description = newEmployee.Description,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        PhoneNumber = user.PhoneNumber,
                    };

                    shouldAdd = true;
                }
                else
                {
                    var existingEmployee = await _db.Employees.SingleOrDefaultAsync(e => e.UserId == existing.Id && e.BusinessId == parseBusinessId);

                    if (existingEmployee == null)
                    {
                        employee = new Employee
                        {
                            Id = Guid.NewGuid(),
                            UserId = existing.Id,
                            BusinessId = parseBusinessId,
                            Role = newEmployee.Role,
                            Position = newEmployee.Position,
                            Description = newEmployee.Description,
                            FirstName = newEmployee.FirstName,
                            LastName = newEmployee.LastName,
                            PhoneNumber = newEmployee.PhoneNumber,
                        };

                        shouldAdd = true;
                    }
                    else
                    {
                        if (existingEmployee.IsDeleted)
                        {
                            existingEmployee.IsDeleted = false;
                            existingEmployee.IsActive = true; // Do I want to activate employee right after revert from soft-delete?
                            existingEmployee.Role = newEmployee.Role;
                            existingEmployee.Position = newEmployee.Position;
                            existingEmployee.Description = newEmployee.Description;
                            existingEmployee.FirstName = newEmployee.FirstName;
                            existingEmployee.LastName = newEmployee.LastName;
                            existingEmployee.PhoneNumber = newEmployee.PhoneNumber;
                            existingEmployee.UpdatedAt = DateTime.UtcNow;

                            employee = existingEmployee;
                        }
                        else
                        {
                            throw new InvalidOperationException("Employee with this email already exists in this business.");
                        }
                    }
                }
            }
            else
            {
                employee = new Employee
                {
                    Id = Guid.NewGuid(),
                    UserId = null,
                    BusinessId = parseBusinessId,
                    Role = newEmployee.Role,
                    Position = newEmployee.Position,
                    Description = newEmployee.Description,
                    FirstName = newEmployee.FirstName,
                    LastName = newEmployee.LastName,
                    PhoneNumber = newEmployee.PhoneNumber,
                };

                shouldAdd = true;
            }

            if (shouldAdd)
            {
                _db.Employees.Add(employee);
            }
            await _db.SaveChangesAsync();

            return new GetEmployeeDto
            {
                Id = employee.Id,
                UserId = employee.UserId,
                BusinessId = employee.BusinessId,
                Role = employee.Role,
                Position = employee.Position,
                Description = employee.Description,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                PhoneNumber = employee.PhoneNumber,
                Email = employee.UserId != null
                ? (existing?.Email ?? user?.Email) : null,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt,
            };
        }

        public async Task DeleteEmployee(string businessId, string employeeId)
        {
            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            var employee = await _db.Employees.SingleOrDefaultAsync(e => e.Id == parseEmployeeId && e.BusinessId == parseBusinessId && !e.IsDeleted);

            if (employee == null)
                throw new KeyNotFoundException("Employee doesn't exist or is not employed by this business");

            if (employee.Role == BusinessRole.Owner)
            {
                throw new InvalidOperationException("Cannot delete the owner of the business.");
            }

            if (employee.ImageUrl != null)
            {
                await RemoveBusinessPicture(employee.ImageUrl, "employee-avatars");
                employee.ImageUrl = null;
            }

            employee.IsDeleted = true;
            employee.IsActive = false;
            employee.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }

        public async Task<BusinessRole?> CheckEmployeeRole(string userId, string businessId)
        {
            if (!Guid.TryParse(userId, out Guid parseUserId))
                throw new ArgumentException("Invalid userId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            var businessExists = await _db.Businesses.AnyAsync(b => b.Id == parseBusinessId);
            if (!businessExists)
                throw new KeyNotFoundException("Business not found");

            var employee = await _db.Employees.SingleOrDefaultAsync(e => e.UserId == parseUserId && e.BusinessId == parseBusinessId);
            if (employee == null)
                return null;

            return employee.Role;
        }

        public async Task<bool> IsEditingOwnProfile(string userId, string employeeId, string businessId)
        {
            if (!Guid.TryParse(userId, out Guid parseUserId))
                throw new ArgumentException("Invalid userId");

            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            bool isSelf = await _db.Employees.Include(e => e.User).AnyAsync(e => e.Id == parseEmployeeId && e.BusinessId == parseBusinessId && e.UserId == parseUserId);

            return isSelf;
        }

        public async Task<List<GetEmployeeDto>> GetBusinessEmployees(string businessId)
        {
            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            List<GetEmployeeDto> employees = await _db.Employees
                .Where(e => e.BusinessId == parseBusinessId && e.IsDeleted == false)
                .Select(e => new GetEmployeeDto
                {
                    Id = e.Id,
                    BusinessId = e.BusinessId,
                    UserId = e.UserId,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Email = e.User != null ? e.User.Email : null,
                    PhoneNumber = e.PhoneNumber,
                    Role = e.Role,
                    Position = e.Position,
                    Description = e.Description,
                    ImageUrl = e.ImageUrl,
                    IsActive = e.IsActive,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                    EmployeeServices = e.EmployeeServices
                    .Select(es => new GetEmployeeService
                    {
                        ServiceId = es.ServiceId,
                        Name = es.Service.Name,
                        DurationMinutes = es.Service.DurationMinutes,
                        Price = es.Service.Price
                    })
                    .ToList()
                })
                .OrderBy(e => e.Role)
                .ThenBy(e => e.CreatedAt)
                .ToListAsync();

            return employees;
        }

        public async Task<GetEmployeeDto> GetBusinessEmployeeById(string businessId, string employeeId)
        {
            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            var employee = await _db.Employees
                .Include(e => e.User)
                .SingleOrDefaultAsync(e => e.Id == parseEmployeeId && e.BusinessId == parseBusinessId);

            if (employee == null)
                throw new ArgumentException("Invalid employeeId or employee doesn't exist");

            var employeeServices = await _db.EmployeeServices
                .Where(es => es.EmployeeId == parseEmployeeId)
                .Include(es => es.Service)
                .ToListAsync();

            employee.EmployeeServices = employeeServices;

            return new GetEmployeeDto
            {
                Id = employee.Id,
                UserId = employee.UserId,
                BusinessId = employee.BusinessId,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.User?.Email,
                PhoneNumber = employee.PhoneNumber,
                Role = employee.Role,
                Position = employee.Position,
                Description = employee.Description,
                ImageUrl = employee.ImageUrl,
                IsActive = employee.IsActive,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt,
                EmployeeServices = employee.EmployeeServices
                .Select(es => new GetEmployeeDto.GetEmployeeService
                {
                    ServiceId = es.ServiceId,
                    Name = es.Service.Name,
                    Description = es.Service.Description,
                    Price = es.Service.Price,
                    DurationMinutes = es.Service.DurationMinutes,
                    IsActive = es.Service.IsActive,
                })
                .ToList()
            };
        }

        public async Task<GetEmployeeDto> PatchBusinessEmployeeById(string businessId, string employeeId, UpdateEmployeeDto editEmployee)
        {
            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");

            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            var employee = await _db.Employees.Include(e => e.User).SingleOrDefaultAsync(e => e.Id == parseEmployeeId && e.BusinessId == parseBusinessId);

            if (employee == null)
                throw new ArgumentException("Invalid employeeId or employee doesn't exist");

            if (editEmployee.FirstName != null)
            {
                if (editEmployee.FirstName.Length < 3 || editEmployee.FirstName.Length > 80)
                    throw new ArgumentException("First name must be between 3 and 80 characters.");
                employee.FirstName = editEmployee.FirstName;
            }

            if (editEmployee.LastName != null)
            {
                if (editEmployee.LastName.Length < 1 || editEmployee.LastName.Length > 80)
                    throw new ArgumentException("Last name must be between 1 and 80 characters.");
                employee.LastName = editEmployee.LastName;
            }

            if (editEmployee.PhoneNumber != null)
            {
                if (!Regex.IsMatch(editEmployee.PhoneNumber, @"^\+?[0-9\s\-]{7,15}$"))
                    throw new ArgumentException("Invalid phone number format.");
                employee.PhoneNumber = editEmployee.PhoneNumber;
            }

            if (editEmployee.Role.HasValue)
            {
                if (!Enum.IsDefined(typeof(BusinessRole), editEmployee.Role.Value))
                    throw new ArgumentException("Invalid role value");

                employee.Role = editEmployee.Role.Value;
            }

            if (editEmployee.Position != null)
            {
                employee.Position = editEmployee.Position;
            }

            if (editEmployee.Description != null)
            {
                employee.Description = editEmployee.Description;
            }

            if (editEmployee.IsActive.HasValue)
            {
                employee.IsActive = editEmployee.IsActive.Value;
            }

            if (employee.UserId == null && editEmployee.Email != null)
            {
                var normalizedEmail = editEmployee.Email.ToLowerInvariant();
                var existing = await _db.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail);
                if (existing == null)
                {
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456"); //TODO: default password - in the future a random password should be generated and a user should receive an email to reset the password.

                    var user = new Models.User
                    {
                        Id = Guid.NewGuid(),
                        FirstName = employee.FirstName,
                        LastName = employee.LastName,
                        Email = editEmployee.Email.ToLowerInvariant(),
                        PhoneNumber = employee.PhoneNumber,
                        PasswordHash = hashedPassword,
                        Role = UserRole.Client,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _db.Users.Add(user);

                    employee.UserId = user.Id;
                }
                else
                {
                    employee.UserId = existing.Id;
                }
            }

            employee.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return new GetEmployeeDto
            {
                Id = employee.Id,
                UserId = employee.UserId,
                BusinessId = employee.BusinessId,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.User?.Email,
                PhoneNumber = employee.PhoneNumber,
                Role = employee.Role,
                Position = employee.Position,
                Description = employee.Description,
                ImageUrl = employee.ImageUrl,
                IsActive = employee.IsActive,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt,
            };
        }

        public async Task<string> PutEmployeePhoto(string employeeId, IFormFile avatar)
        {
            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            var employee = await _db.Employees.SingleOrDefaultAsync(e => e.Id == parseEmployeeId);

            if (employee == null)
                throw new ArgumentException("Invalid employeeId or employee doesn't exist");

            var url = await UploadBusinessPicture(avatar, "employee-avatars");
            if (url == null)
                throw new ArgumentException("Something went wrong when uploading avatar");

            if (employee.ImageUrl != null)
            {
                await RemoveBusinessPicture(employee.ImageUrl, "employee-avatars");
            }

            employee.ImageUrl = url;

            await _db.SaveChangesAsync();

            return url;
        }

        public async Task<bool> DeleteEmployeePhoto(string employeeId)
        {
            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            var employee = await _db.Employees.SingleOrDefaultAsync(e => e.Id == parseEmployeeId);

            if (employee == null)
                throw new ArgumentException("Invalid employeeId or employee doesn't exist");

            if (employee.ImageUrl != null)
            {
                await RemoveBusinessPicture(employee.ImageUrl, "employee-avatars");
            }

            employee.ImageUrl = null;

            await _db.SaveChangesAsync();

            return true;
        }

        public async Task AssignServicesToEmployee(string employeeId, string businessId, List<Guid> servicesList)
        {
            if (!Guid.TryParse(employeeId, out Guid parseEmployeeId))
                throw new ArgumentException("Invalid employeeId");

            if (!Guid.TryParse(businessId, out Guid parseBusinessId))
                throw new ArgumentException("Invalid businessId");


            var existing = await _db.EmployeeServices
                .Where(es => es.EmployeeId == parseEmployeeId)
                .ToListAsync();

            var validServiceIds = await _db.Services
                .Where(s => s.BusinessId == parseBusinessId && servicesList.Contains(s.Id))
                .Select(s => s.Id)
                .ToListAsync();

            var now = DateTime.UtcNow;

            var newRelations = validServiceIds.Select(serviceId =>
                new EmployeeService
                {
                    EmployeeId = parseEmployeeId,
                    ServiceId = serviceId,
                    CreatedAt = now,
                });

            _db.EmployeeServices.RemoveRange(existing);
            await _db.EmployeeServices.AddRangeAsync(newRelations);
            await _db.SaveChangesAsync();
        }
    }
}
