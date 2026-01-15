using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class Service
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BusinessId { get; set; }

        [ForeignKey(nameof(BusinessId))]
        public Business Business { get; set; } = null!;

        public Guid? ServiceCategoryId { get; set; }
        [ForeignKey(nameof(ServiceCategoryId))]
        public ServiceCategory? ServiceCategory { get; set; }

        [Required]
        [MinLength(3)]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public int DurationMinutes { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<EmployeeService> EmployeeServices { get; set; } = new List<EmployeeService>();

        // Navigation
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}