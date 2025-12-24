using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class EmployeeService
    {
        [Key, Column(Order = 0)]
        public Guid EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        [Key, Column(Order = 1)]
        public Guid ServiceId { get; set; }
        public Service Service { get; set; } = null!;
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

    }
}
