using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models.Dto
{
    public class GetEmployeeDto
    {
        public Guid Id { get; set; }

        public Guid? UserId { get; set; }

        public Guid BusinessId { get; set; }

        public BusinessRole Role { get; set; }
        
        public string? Position { get; set; }
        public string? Description { get; set; }

        public bool? IsActive { get; set; }

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? ImageUrl { get; set; }

        public List<GetEmployeeService> EmployeeServices { get; set; } = new();

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public class GetEmployeeService
        {
            public Guid ServiceId { get; set; }
            public string Name { get; set; } = null!;
            public string? Description { get; set; }
            public decimal Price { get; set; }
            public int DurationMinutes { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
