namespace BookujApi.Models.Interfaces
{
    public interface ISortableEntity
    {
        Guid Id { get; }
        Guid BusinessId { get; }
        int SortOrder { get; set; }
    }
}
