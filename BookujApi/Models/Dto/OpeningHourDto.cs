using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models.Dto
{
    public class OpeningHourDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public WeekDay DayOfWeek { get; set; }

        [Required]
        public bool IsOpen { get; set; }

        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }

    }
}
