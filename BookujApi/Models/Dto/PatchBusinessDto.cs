using System;

namespace BookujApi.Models.Dto
{
    public class PatchBusinessDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }

        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public bool? IsActive { get; set; }
        public string? InstagramUrl { get; set; }
        public string? FacebookUrl { get; set; }
        public string? WebsiteUrl { get; set; }

        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
