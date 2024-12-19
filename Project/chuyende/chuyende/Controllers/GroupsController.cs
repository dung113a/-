using Microsoft.AspNetCore.Mvc;

namespace Cado.Controllers
{
    public class GroupsController : Controller
    {
        // GET: /Groups
        public IActionResult Index()
        {
            return View("Groups");
        }
    }
}
