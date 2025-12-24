using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Dto
{
    public class UserPersonalInformationDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;

        [FromForm(Name = "file")]
        public IFormFile? File { get; set; }
        public string? ImageUrl { get; set; }

    }
}
