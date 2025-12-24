using BookujApi.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookujApi.Models
{
    public class Subscription
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BusinessId { get; set; }

        [ForeignKey(nameof(BusinessId))]
        public Business Business { get; set; } = null!;

        [Required]
        public string PlanName { get; set; } = null!;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }

        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}