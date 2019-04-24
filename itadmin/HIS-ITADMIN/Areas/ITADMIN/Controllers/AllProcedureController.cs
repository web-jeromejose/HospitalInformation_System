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
    public class AllProcedureController : BaseController
    {
        //
        // GET: /ITADMIN/AllProcedure/
        CPTCodeModel model = new CPTCodeModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2695")]
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult AllprocDepartment()
        {

            List<RoleModel> li = model.AllprocDepartment();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AllprocOPBService()
        {

            List<RoleModel> li = model.AllprocOPBService();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AllprocIPBService()
        {

            List<RoleModel> li = model.AllprocIPBService();
            return Json(li, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Dashboard(ALlDashEntry entry)
        {
            List<AllProcDal> list = model.AllprocDashboard(entry.DeptId, entry.OPBServiceId, entry.IPBServiceId);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AllProcDal>() }),
                ContentType = "application/json"
            };
            return result;
        }



    }
}
