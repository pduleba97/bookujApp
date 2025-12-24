namespace BookujApi.Models.Dto
{
    public class ServiceDto
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; } 
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
    }

}
