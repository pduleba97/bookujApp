using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class BusinessListItemDto 
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string Category { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string City { get; set; } = null!;

        public string PostalCode { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
