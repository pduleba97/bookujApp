using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class Business
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid OwnerId { get; set; }

        [ForeignKey(nameof(OwnerId))]
        public User Owner { get; set; } = null!;

        [Required]
        [MaxLength(80)]
        public string Name { get; set; } = null!;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(80)]
        public string Category { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string PhoneNumber { get; set; } = null!;

        [Required]
        [MaxLength(120)]
        public string Address { get; set; } = null!;
        [Required]
        [MaxLength(60)]
        public string City { get; set; } = null!;
        [Required]
        [MaxLength(10)]
        public string PostalCode { get; set; } = null!;

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public bool IsActive { get; set; } = false;

        [MaxLength(500)]
        public string? LogoUrl { get; set; }
        [MaxLength(500)]
        public string? ProfilePictureUrl { get; set; } //Old ImageUrl
        [MaxLength(500)]
        public string? InstagramUrl { get; set; }
        [MaxLength(500)]
        public string? FacebookUrl { get; set; }
        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }


        // Navigation
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<OpeningHour> OpeningHours { get; set; } = new List<OpeningHour>();
        public ICollection<BusinessPhoto> BusinessPhotos { get; set; } = new List<BusinessPhoto>();

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}