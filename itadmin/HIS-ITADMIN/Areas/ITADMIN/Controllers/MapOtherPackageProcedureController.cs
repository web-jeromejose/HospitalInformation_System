using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class MapOtherPackageProcedureController : BaseController
    {
        //
        //GET: /ITADMIN/MapOtherPackageProcedure/
        MapOtherPackageProcedModel bs = new MapOtherPackageProcedModel();
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult PackageServiceList(string id)
        {
            List<PackageServiceList> list = bs.PacakgeServiceDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult MapOtherProcedDashBoard()
        {
            MapOtherPackageProcedModel model = new MapOtherPackageProcedModel();
            List<MapOtherProcedureDashboard> list = model.MapOtherProcedureDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MapOtherProcedureDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public ActionResult SelectedListItem(int Id)
        {
            MapOtherPackageProcedModel model = new MapOtherPackageProcedModel();
            List<MapOtherProcedureView> list = model.MapOtherProcedureView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MapOtherProcedureView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OtherPackageHeaderSave entry)
        {
            MapOtherPackageProcedModel model = new MapOtherPackageProcedModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "MapOtherPackageProcedureController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
