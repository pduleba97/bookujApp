using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class EditServiceDto
    {
        [Required(ErrorMessage = "Service ID is required")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Business ID is required")]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Required(ErrorMessage = "Service price is required")]
        public decimal Price { get; set; }
        [Required(ErrorMessage = "Service duration is required")]
        [Range(1, 1440, ErrorMessage = "Service has to last between 1 and 1440 minutes (maximum of 24h)")]
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
    }
}
