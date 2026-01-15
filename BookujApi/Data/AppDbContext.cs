using BookujApi.Enums;
using BookujApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookujApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<OpeningHour> OpeningHours { get; set; }
        public DbSet<EmployeeService> EmployeeServices { get; set; }
        public DbSet<BusinessPhoto> BusinessPhotos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // mapowanie enumów postgresowych
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasPostgresEnum<UserRole>();
            modelBuilder.HasPostgresEnum<AppointmentStatus>();
            modelBuilder.HasPostgresEnum<SubscriptionStatus>();

            modelBuilder.Entity<EmployeeService>()
                .HasKey(es => new { es.EmployeeId, es.ServiceId });

            modelBuilder.Entity<EmployeeService>()
                .HasOne(es => es.Employee)
                .WithMany(e => e.EmployeeServices)
                .HasForeignKey(es => es.EmployeeId);

            modelBuilder.Entity<EmployeeService>()
                .HasOne(es => es.Service)
                .WithMany(s => s.EmployeeServices)
                .HasForeignKey(es => es.ServiceId);

            modelBuilder.Entity<Service>()
                .HasOne(s => s.ServiceCategory)
                .WithMany(sc => sc.Services)
                .HasForeignKey(s => s.ServiceCategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
