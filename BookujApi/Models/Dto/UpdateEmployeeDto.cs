using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class UpdateEmployeeDto
    {
        public BusinessRole? Role { get; set; }
        public string? Position { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        [Phone]
        public string? PhoneNumber { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
    }
}
