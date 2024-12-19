using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using chuyende.Data;
using System.Linq;
using System.Threading.Tasks;

namespace chuyende.Controllers
{
    public class PerformanceController : Controller
    {
        private readonly SchoolPerformanceContext _context;

        public PerformanceController(SchoolPerformanceContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetChartData()
        {
            // Nhóm dữ liệu theo ClassName và PerformanceDate, sau đó tính điểm trung bình
            var groupedData = await _context.ClassPerformances
                .GroupBy(p => new { p.ClassName, p.PerformanceDate })
                .Select(g => new
                {
                    ClassName = g.Key.ClassName,
                    PerformanceDate = g.Key.PerformanceDate,
                    AverageScore = g.Average(p => p.Score)
                })
                .OrderBy(g => g.PerformanceDate)
                .ToListAsync();

            // Trả về JSON cho JavaScript
            return Json(groupedData);
        }
    }
}
