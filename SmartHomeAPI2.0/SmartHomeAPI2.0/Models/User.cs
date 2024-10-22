using System.ComponentModel.DataAnnotations;

namespace SmartHomeAPI2._0.Models
{
    public class User
    {

            public int Id { get; set; }

            [Required]
            public string Name { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }

            public bool IsAdmin { get; set; }
        }
}
