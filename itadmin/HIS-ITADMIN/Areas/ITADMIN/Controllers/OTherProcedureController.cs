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
    public class OTherProcedureController : BaseController
    {
        //
        // GET: /ITADMIN/OTherProcedure/
        OtherProcedureModel bs = new OtherProcedureModel();
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OtherProcedureSaveModel entry)
        {
            OtherProcedureModel model = new OtherProcedureModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OTherProcedureController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public ActionResult OtherProcedureDashBoard()
        {
            OtherProcedureModel model = new OtherProcedureModel();
            List<OtherProcedureDashBoardModel> list = model.OtherProcedureDashBoardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OtherProcedureDashBoardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchOtherProcedure(int Id)
        {
            OtherProcedureModel model = new OtherProcedureModel();
            List<OtherProcedViewModel> list = model.OtherProcedViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OtherProcedViewModel>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bs.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SpecializationList(string id)
        {
            List<ListSpecializationModel> list = bs.ListSpecializationModel(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}
