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
    public class PTProcedureController : BaseController
    {
        //
        // GET: /ITADMIN/PTProcedure/
        PTProcedureModel bs = new PTProcedureModel();

        [IsSGHFeatureAuthorized(mFeatureID = "1993")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PTProcedDashBoard()
        {
            PTProcedureModel model = new PTProcedureModel();
            List<PTProcedureDashBoard> list = model.PTProcedureDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PTProcedureDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchPTView(int Id)
        {
            PTProcedureModel model = new PTProcedureModel();
            List<PTProcedViewModel> list = model.PTProcedViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PTProcedViewModel>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bs.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PTProcedureSaveModel entry)
        {
            PTProcedureModel model = new PTProcedureModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "PTProcedureController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
