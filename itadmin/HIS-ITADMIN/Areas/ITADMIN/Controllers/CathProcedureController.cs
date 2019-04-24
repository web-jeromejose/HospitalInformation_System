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
    public class CathProcedureController : BaseController
    {
        //
        // GET: /ITADMIN/CathProcedure/
        CathProcedModel bs = new CathProcedModel();

        [IsSGHFeatureAuthorized(mFeatureID = "569")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CathProcedDashBoard()
        {
            CathProcedModel model = new CathProcedModel();
            List<CathProcedDashBoard> list = model.CathProcedDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CathProcedDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchCathView(int Id)
        {
            CathProcedModel model = new CathProcedModel();
            List<CathProcedViewModel> list = model.CathProcedViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CathProcedViewModel>() }),
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
        public ActionResult Save(CathProcedureSaveModel entry)
        {
            CathProcedModel model = new CathProcedModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CathProcedureController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
