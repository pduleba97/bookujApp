using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class Employee
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; } = null!;

        [Required]
        public Guid BusinessId { get; set; }

        [ForeignKey(nameof(BusinessId))]
        public Business Business { get; set; } = null!;

        public BusinessRole Role { get; set; }

        public string? Position { get; set; }
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        public string? PhoneNumber { get; set; }

        public string? ImageUrl { get; set; }

        // Navigation
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<EmployeeService>? EmployeeServices { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}