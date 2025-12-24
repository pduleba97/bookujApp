using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class BusinessDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(80, ErrorMessage = "Name cannot exceed 80 characters")]
        public string Name { get; set; } = null!;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        [StringLength(80, ErrorMessage = "Category cannot exceed 80 characters")]
        public string Category { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Phone is required")]
        [Phone]
        public string PhoneNumber { get; set; } = null!;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(120, ErrorMessage = "Address cannot exceed 120 characters")]
        public string Address { get; set; } = null!;
        [Required(ErrorMessage = "City is required")]
        [StringLength(60, ErrorMessage = "City cannot exceed 60 characters")]
        public string City { get; set; } = null!;
        [Required(ErrorMessage = "Postal Code is required")]
        [StringLength(10, ErrorMessage = "Postal Code cannot exceed 10 characters")]
        public string PostalCode { get; set; } = null!;

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public List <GetOpeningHourDto> OpeningHours { get; set; } = new();
        public List<GetService> Services { get; set; } = new();

        [FromForm(Name = "file")]
        public IFormFile? File { get; set; }

        public class GetOpeningHourDto
        {
            [Required(ErrorMessage = "Day of week is required")]
            public WeekDay DayOfWeek { get; set; }
            [Required(ErrorMessage = "Is open (working day true/false) is required")]
            public bool IsOpen { get; set; }
            [Required(ErrorMessage = "Business opening hour is required")]
            public TimeSpan? OpenTime { get; set; }
            [Required(ErrorMessage = "Business closing hour is required")]
            public TimeSpan? CloseTime { get; set; }
        }

        public class GetService
        {
            [Required(ErrorMessage = "Name is required")]
            public string Name { get; set; } = null!;
            public string? Description { get; set; }
            [Required(ErrorMessage = "Service price is required")]
            public decimal Price { get; set; }
            [Required(ErrorMessage = "Service duration is required")]
            [Range(1, 1440,ErrorMessage ="Service has to last between 1 and 1440 minutes (maximum of 24h)")]
            public int DurationMinutes { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
