
using System;

namespace chuyende.Models // Thay thế 'YourNamespace' bằng namespace thực tế của bạn
{
    public class ClassPerformance
    {
        public int Id { get; set; }
        public string?  ClassName { get; set; } // Phải khớp với kiểu dữ liệu
        public DateTime PerformanceDate { get; set; } // Phải là kiểu DateTime
        public int Score { get; set; }
    }

}
