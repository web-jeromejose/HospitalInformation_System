using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DataLayer;

namespace HIS.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            ConstantModel cons = new ConstantModel();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();
           
           // return RedirectToAction("Index", "Main", menu);
            return View(menu);
        }

      //asdfasdfasdf   
        public JsonResult ChangeStation(int stationId)
        {
            this.StationId = stationId;
            /***WARDS ONLY***/
            var result = new { };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult GetMenu()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            ConstantModel cons = new ConstantModel();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();
            if(menu.Count == 0)
                return PartialView("_UnAuthorized", menu ?? new List<ApplicationMenuModel>());
            else
            return PartialView("_Menu", menu ?? new List<ApplicationMenuModel>());
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }


    }
}
