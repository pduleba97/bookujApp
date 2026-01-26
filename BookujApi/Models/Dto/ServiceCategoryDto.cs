namespace BookujApi.Models.Dto
{
    public class ServiceCategoryDto
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public IEnumerable<ServiceDto> Services { get; set; } = new List<ServiceDto>();
    }
}
