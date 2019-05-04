using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;


namespace HIS_BloodBank.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home", new { area = "BLOODBANK" });   
        }


        public JsonResult ChangeStation(int stationId)
        {
            this.StationId = stationId;
            /***WARDS ONLY***/
            var result = new { };
            return Json(result);
        }

        public ActionResult LogOff()
        {
            this.IsSet = 0;
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }
        public PartialViewResult GetMenu()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            ConstantModel cons = new ConstantModel();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();
            if (menu.Count == 0)
                return PartialView("_UnAuthorized", menu ?? new List<ApplicationMenuModel>());
            else
                return PartialView("_Menu", menu ?? new List<ApplicationMenuModel>());
        }

    }
}
