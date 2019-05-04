using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    /// <summary>
    /// Used when an ajax request throws error.
    /// This enable you return a json response.
    /// </summary>
    public class ErrorController : Controller
    {
        public JsonResult GetJsonError(Exception ex)
        {
            //you can also manipulate your exception before sending back to user.
            //e.g. log to text fles, return custom error message or etc.
            return Json(new { Result = false }, JsonRequestBehavior.AllowGet);
        }
    }
}