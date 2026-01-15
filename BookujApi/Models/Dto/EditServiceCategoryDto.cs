using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class EditServiceCategoryDto
    {
        [MinLength(3)]
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
