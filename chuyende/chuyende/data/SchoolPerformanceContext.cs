using chuyende.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace chuyende.Data
{
    public class SchoolPerformanceContext : DbContext
    {
        public SchoolPerformanceContext(DbContextOptions<SchoolPerformanceContext> options)
            : base(options)
        {
        }

        public required DbSet<ClassPerformance> ClassPerformances { get; set; }
    }

}
