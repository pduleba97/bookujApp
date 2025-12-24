using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class Appointment
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ClientId { get; set; }

        [Required]
        public Guid EmployeeId { get; set; }

        [Required]
        public Guid ServiceId { get; set; }

        [ForeignKey(nameof(ClientId))]
        public User Client { get; set; } = null!;

        [ForeignKey(nameof(EmployeeId))]
        public Employee Employee { get; set; } = null!;

        [ForeignKey(nameof(ServiceId))]
        public Service Service { get; set; } = null!;

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Booked;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}