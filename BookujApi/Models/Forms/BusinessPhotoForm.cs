using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BookujApi.Models.Forms
{
    public class BusinessPhotoForm
    {
        [FromForm(Name = "logoFile")]
        public IFormFile? LogoFile { get; set; }
        [FromForm(Name = "profilePictureFile")]
        public IFormFile? ProfilePictureFile { get; set; }
        [FromForm(Name = "galleryFile")]
        public IFormFile? GalleryFile { get; set; }
    }
}
