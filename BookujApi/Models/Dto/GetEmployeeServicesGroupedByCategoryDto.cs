namespace BookujApi.Models.Dto
{
    public class GetEmployeeServicesGroupedByCategoryDto
    {
        public Guid? CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public List<ServiceDto> Services { get; set; } = new();
    }
}
