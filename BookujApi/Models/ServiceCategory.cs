using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    [Index(nameof(BusinessId), nameof(Name), IsUnique = true)] //Assures that name is unique for given BusinessId
    public class ServiceCategory
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BusinessId { get; set; }
        [ForeignKey(nameof(BusinessId))]
        public Business Business { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
