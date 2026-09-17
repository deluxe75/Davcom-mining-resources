namespace Davcom.Admin.Models;

public class Equipment
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public string Capacity { get; set; } = string.Empty;
    public string Status { get; set; } = "available"; // available, deployed, maintenance
    public string Image { get; set; } = string.Empty;
    public string Specifications { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
