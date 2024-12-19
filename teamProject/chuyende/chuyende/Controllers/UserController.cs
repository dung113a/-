using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http; // để dùng session
using System;
using chuyende.Models;

namespace chuyende.Controllers
{
    public class UserController : Controller
    {
        private string connectionString = @"Server=tcp:takmingworddb.database.windows.net,1433;Initial Catalog=WebApplication1_db;Persist Security Info=False;User ID=takmingsa;Password=Takming.;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

        public IActionResult Profile()
        {
            string uacc = HttpContext.Session.GetString("Uacc") ?? string.Empty;

            if (string.IsNullOrEmpty(uacc))
            {
                return RedirectToAction("Login", "Account");
            }

            string query = "SELECT Una, Uacc, Upwd, Uemail, Star, Uavatar, RegisterDate FROM User_Information WHERE Uacc = @Uacc";

            try
            {
                using (SqlConnection cnn = new SqlConnection(connectionString))
                using (SqlCommand cmd = new SqlCommand(query, cnn))
                {
                    cmd.Parameters.AddWithValue("@Uacc", uacc);
                    cnn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // In từng dòng dữ liệu trả về từ database
                            Console.WriteLine($"Row: Una={reader["Una"]}, Uacc={reader["Uacc"]}, Upwd={reader["Upwd"]}, Uemail={reader["Uemail"]}, Star={reader["Star"]}, Uavatar={reader["Uavatar"]}, RegisterDate={reader["RegisterDate"]}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

            return View();
        }
    }
    }
