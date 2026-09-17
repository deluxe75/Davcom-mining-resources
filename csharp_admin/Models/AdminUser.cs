namespace Davcom.Admin.Models;

public class AdminUser
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "operations_lead"; // super_admin, operations_lead, fleet_manager, site_engineer
    public string Designation { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
