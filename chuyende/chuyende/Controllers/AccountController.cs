using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;

namespace chuyende.Controllers
{
    public class AccountController : Controller
    {
        private string connectionString = @"Server=tcp:takmingworddb.database.windows.net,1433;Initial Catalog=WebApplication1_db;Persist Security Info=False;User ID=takmingsa;Password=Takming.;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

        // Hiển thị trang đăng nhập
        public IActionResult Login()
        {
            return View();
        }

        // Xử lý yêu cầu đăng nhập (POST)
        [HttpPost]
        public IActionResult Login(string Uacc, string pwd)
        {
            // Kiểm tra thông tin đăng nhập trong cơ sở dữ liệu
            string query = "SELECT COUNT(*) FROM User_Information WHERE Uacc = @Uacc AND Upwd = @Upwd";
            try
            {
                using (SqlConnection cnn = new SqlConnection(connectionString))
                using (SqlCommand cmd = new SqlCommand(query, cnn))
                {
                    cmd.Parameters.AddWithValue("@Uacc", Uacc);
                    cmd.Parameters.AddWithValue("@Upwd", pwd);

                    cnn.Open();
                    int userCount = (int)cmd.ExecuteScalar();

                    if (userCount > 0)
                    {
                        HttpContext.Session.SetString("Uacc", Uacc);
                        Console.WriteLine("Session value set: " + HttpContext.Session.GetString("Uacc"));
                        return RedirectToAction("Index", "Home");
                    }


                    else
                    {
                        // Sai tên đăng nhập hoặc mật khẩu
                        ViewBag.ErrorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
                        return View();
                    }
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                ViewBag.ErrorMessage = "Đã xảy ra lỗi trên server, vui lòng thử lại sau.";
                Console.WriteLine("Error: " + ex.Message);
                return View();
            }
        }

        // Xử lý đăng xuất
        public IActionResult Logout()
        {
            // Xoá session khi đăng xuất
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}
