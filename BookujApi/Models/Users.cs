using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        public string? PhoneNumber { get; set; }

        [Required]
        public string PasswordHash { get; set; } = null!;

        public UserRole Role { get; set; } = UserRole.Client;

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        // Navigation
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<Business>? OwnedBusinesses { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}