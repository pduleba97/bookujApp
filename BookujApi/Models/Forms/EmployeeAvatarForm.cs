using Microsoft.AspNetCore.Mvc;

namespace BookujApi.Models.Forms
{
    public class EmployeeAvatarForm
    {
        [FromForm(Name = "avatarFile")]
        public IFormFile? AvatarFile { get; set; }
    }
}
