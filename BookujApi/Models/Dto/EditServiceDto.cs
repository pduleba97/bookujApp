using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class EditServiceDto
    {
        [Required(ErrorMessage = "Service ID is required")]
        public Guid Id { get; set; }
        public Guid? ServiceCategoryId { get; set; }
        [MinLength(3)]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? DurationMinutes { get; set; }
        public bool? IsActive { get; set; }
    }
}
