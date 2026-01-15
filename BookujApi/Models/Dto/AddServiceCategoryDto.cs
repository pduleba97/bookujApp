using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class AddServiceCategoryDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;
        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
