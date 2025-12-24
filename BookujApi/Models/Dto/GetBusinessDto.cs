using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models.Dto
{
    public class GetBusinessDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Category { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
        public bool IsActive { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? LogoUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? FacebookUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public UserDto Owner { get; set; } = null!;
        public List<GetOpeningHourDto> OpeningHours { get; set; } = new();
        public List<GetServiceDto> Services { get; set; } = new();
        public List<GetBusinessPhoto> BusinessPhotos { get; set; } = new();
        public List<GetBusinessEmployeeDto> Employees { get; set; } = new();

        public class GetOpeningHourDto
        {
            public Guid Id { get; set; }
            public WeekDay DayOfWeek { get; set; }
            public bool IsOpen { get; set; }
            public TimeSpan? OpenTime { get; set; }
            public TimeSpan? CloseTime { get; set; }
        }

        public class GetServiceDto
        {
            public Guid Id { get; set; }
            public string Name { get; set; } = null!;
            public string? Description { get; set; }
            public decimal Price { get; set; }
            public int DurationMinutes { get; set; }
            public bool IsActive { get; set; } = true;
        }

        public class GetBusinessPhoto
        {
            public Guid Id { get; set; }
            public string ImageUrl { get; set; } = null!;
            public BusinessPhotoType Type { get; set; } = BusinessPhotoType.Other;
            public int? SortOrder { get; set; }
        }

        public class GetBusinessEmployeeDto
        {
            public Guid Id { get; set; }
            public BusinessRole Role { get; set; }
            public string? Position { get; set; }
            public string? Description { get; set; }
            public bool IsActive { get; set; }
            public string FirstName { get; set; } = null!;
            public string LastName { get; set; } = null!;
            public string? ImageUrl { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime? UpdatedAt { get; set; }
        }
    }
}
