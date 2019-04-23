using DataLayer;
using HIS.Controllers;
using HIS_OT.Areas.OTForms.Models;
using OTEf.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;


namespace HIS_OT.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        private IPatientBusiness patientBusiness;

        public HomeController(IPatientBusiness business) {

            patientBusiness = business;
        }

        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home", new { area = "OT" });   
        }
 

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }


        public JsonResult ChangeStation(int stationId)
        {
            this.StationId = stationId;
            var result = new { };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //public PartialViewResult GetMenu()
        //{
        //    ApplicationVersionModel apps = new ApplicationVersionModel();
        //    ApplicationGlobal glob = new ApplicationGlobal();
        //    ConstantModel cons = new ConstantModel();

        //    glob.UserID = this.OperatorId.ToString();
        //    List<ApplicationMenuModel> menu = glob.GetApplicationMenu();

        //    return PartialView("_Menu", menu);
        //}

        public PartialViewResult GetMenu()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            ConstantModel cons = new ConstantModel();
            glob.UserID = this.OperatorId.ToString();
            glob.ModuleID = "5";
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();
            if (menu.Count == 0)
                return PartialView("_UnAuthorized", menu ?? new List<ApplicationMenuModel>());
            else
                return PartialView("_Menu", menu ?? new List<ApplicationMenuModel>());
        }

        public JsonResult GetApplicationIssue()
        {
            ApplicationGlobal glob = new ApplicationGlobal();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationIssueModel> iss = glob.GetApplicationIssueDAL();
            return Json(iss, JsonRequestBehavior.AllowGet);
        }


    }
}
