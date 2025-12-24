using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class BusinessPhoto
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BusinessId { get; set; }

        [ForeignKey(nameof(BusinessId))]
        public Business Business { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = null!;

        public BusinessPhotoType Type { get; set; } = BusinessPhotoType.Other;

        public int? SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public enum BusinessPhotoType
    {
        Interior = 1,
        Exterior = 2,
        WorkExample = 3,
        Team = 4,
        Certificate = 5,
        Other = 99
    }
}
