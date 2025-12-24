using BookujApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public enum WeekDay
    {
        Monday = 0,
        Tuesday = 1,
        Wednesday = 2,
        Thursday = 3,
        Friday = 4,
        Saturday = 5,
        Sunday = 6
    }

    public class OpeningHour
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BusinessId { get; set; }

        [ForeignKey(nameof(BusinessId))]
        public Business Business { get; set; } = null!;

        [Required]
        public WeekDay DayOfWeek { get; set; }

        [Required]
        public bool IsOpen { get; set; }

        // HH:mm
        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}