using Microsoft.EntityFrameworkCore;
using SmartHomeAPI2._0.Models;

namespace SmartHomeAPI2._0.Data
{
  
        public class SmartHomeContext : DbContext
        {
            public SmartHomeContext(DbContextOptions<SmartHomeContext> options) : base(options) { }

            public DbSet<User> Users { get; set; }
            public DbSet<Device> Devices { get; set; }
            public DbSet<Notification> Notifications { get; set; }
        }
}
