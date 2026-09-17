namespace Davcom.Admin.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Client { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Status { get; set; } = "completed"; // ongoing, completed, planning
    public int Featured { get; set; } = 0;
    public DateTime? CompletionDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
