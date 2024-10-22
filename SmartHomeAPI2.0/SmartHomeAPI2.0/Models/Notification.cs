using System;

namespace SmartHomeAPI2._0.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public string Message { get; set; }
        public int UserId { get; set; }
        public DateTime SentTime { get; set; }
    }
}
