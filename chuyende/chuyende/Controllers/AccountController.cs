using Microsoft.AspNetCore.Mvc;

namespace chuyende.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account/Login
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string username, string password)
        {
            // Giả sử đây là logic kiểm tra thông tin đăng nhập
            if (username == "ad" && password == "pas")
            {
                // Nếu thông tin đăng nhập hợp lệ, chuyển hướng đến trang Home
                return RedirectToAction("Index", "Home");
            }

            // Nếu thông tin đăng nhập không đúng, hiển thị thông báo lỗi
            ViewBag.ErrorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
            return View();
        }

        public IActionResult Logout()
        {
            // Logic để đăng xuất người dùng
            // Ví dụ: Xóa session và chuyển hướng đến trang đăng nhập
            return RedirectToAction("Login", "Account");
        }
    }


}
