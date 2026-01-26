using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public enum WeekDay
    {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6
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

        [Required]
        public DateOnly ValidFrom { get; set; }
        public DateOnly? ValidTo { get; set; } // null = still valid

        // HH:mm
        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}