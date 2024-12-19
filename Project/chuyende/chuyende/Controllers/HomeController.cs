    using System;
    using System.Diagnostics;
    using chuyende.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Data.SqlClient;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;

    namespace chuyende.Controllers
    {
        public class HomeController : Controller
        {
            private readonly ILogger<HomeController> _logger;

            // Chuỗi kết nối đến CSDL (Cập nhật theo chuỗi kết nối của bạn)
            private string connectionString = @"Server=tcp:takmingworddb.database.windows.net,1433;Initial Catalog=WebApplication1_db;Persist Security Info=False;User ID=takmingsa;Password=Takming.;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

            public HomeController(ILogger<HomeController> logger)
            {
                _logger = logger;
            }
        public IActionResult Index()
        {
            // Lấy Uacc từ Session để kiểm tra đăng nhập
            string? uacc = HttpContext.Session.GetString("Uacc");

            if (string.IsNullOrEmpty(uacc))
            {
                // Nếu không có giá trị trong Session, chuyển hướng về trang Login
                return RedirectToAction("Login", "Account");
            }

            UserProfile userProfile = new UserProfile();

            // Nếu đã đăng nhập, truy vấn DB lấy thông tin người dùng
            string query = "SELECT Una, Uacc, Upwd, Uemail, Star, Uavatar, RegisterDate FROM User_Information WHERE Uacc LIKE @Uacc";

            try
            {
                using (SqlConnection cnn = new SqlConnection(connectionString))
                using (SqlCommand cmd = new SqlCommand(query, cnn))
                {
                    cmd.Parameters.AddWithValue("@Uacc", uacc);
                    cnn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            userProfile.Una = reader["Una"]?.ToString();
                            userProfile.Uacc = reader["Uacc"]?.ToString();
                            userProfile.Upwd = reader["Upwd"]?.ToString();
                            userProfile.Uemail = reader["Uemail"]?.ToString();
                            userProfile.Star = reader["Star"] == DBNull.Value ? 0 : Convert.ToInt32(reader["Star"]);
                            userProfile.Uavatar = reader["Uavatar"]?.ToString();
                            userProfile.RegisterDate = reader["RegisterDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["RegisterDate"]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Lỗi truy vấn DB: " + ex.Message);
                // Xử lý lỗi và có thể hiển thị một thông báo lỗi thân thiện với người dùng
            }

            // Trả view kèm model
            return View(userProfile);
        }


        public IActionResult Privacy()
            {
                return View();
            }

            public IActionResult Login()
            {
                return View();
            }

            [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
            public IActionResult Error()
            {
                return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
            }
        }
    }
