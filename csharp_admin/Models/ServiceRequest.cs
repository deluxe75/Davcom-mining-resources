namespace Davcom.Admin.Models;

public class ServiceRequest
{
    public int Id { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string ProjectLocation { get; set; } = string.Empty;
    public string EstimatedBudget { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "pending"; // pending, under_review, approved, rejected
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
