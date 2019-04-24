using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using DataLayer.Common;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class ModuleViewController : BaseController
    {
        //
        // GET: /ITADMIN/ModuleView/
        MasterModel model = new MasterModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2691")]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ModuleViewDashboard(int ModuleId,int UserId,int FeatId)
        {
            List<ModuleViewDashboarddal> list = model.ModuleViewDashboard(ModuleId, UserId, FeatId);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ModuleViewDashboarddal>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult UserModuleViewDashboard(int ModuleId, int UserId)
        {
            List<ModuleViewDashboarddal> list = model.UserModuleViewDashboard(ModuleId, UserId);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ModuleViewDashboarddal>() }),
                ContentType = "application/json"
            };
            return result;
        }

        

        public JsonResult ModuleAccessList()
        {
            List<ListModel> li = model.GetModules();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult EmployeeList()
        {
            List<ListModel> li = model.GetEmployeeList();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FeatureListByModuleId(int ModuleId)
        {
            List<ListModel> li = model.FeatureListByModuleId(ModuleId);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        
     public JsonResult RemoveAccessSave( string RmvType,string UserId,string featureid,string functionId)
        {
            string li = model.RemoveAccessSave(RmvType, UserId, featureid, functionId);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(UserId);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RemoveAccessSave", "ModuleViewController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(li, JsonRequestBehavior.AllowGet);
        }


    }
}
