using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models.Dto
{
    public class AddEmployeeDto
    {

        [Required]
        public BusinessRole Role { get; set; } = BusinessRole.Employee;

        public string? Position { get; set; }
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }
    }
}
