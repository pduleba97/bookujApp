using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Forms
{
    public class BusinessForm
    {
        [FromForm(Name = "json")]
        [Required]
        public required string Json { get; set; }

        [FromForm(Name = "file")]
        public IFormFile? File { get; set; }
    }
}
