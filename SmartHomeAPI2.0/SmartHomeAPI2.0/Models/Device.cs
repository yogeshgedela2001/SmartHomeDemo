using System.ComponentModel.DataAnnotations;

namespace SmartHomeAPI2._0.Models
{
    public class Device
    {
        public int DeviceId { get; set; }

        [Required]
        public string Name { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool Status { get; set; }
        public bool isActive { get; set; }

        public int ownerId { get; set; }

    }
}
