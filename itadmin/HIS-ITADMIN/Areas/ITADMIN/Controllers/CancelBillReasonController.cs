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
    public class CancelBillReasonController : BaseController
    {
        //
        // GET: /ITADMIN/CancelBillReason/
        [IsSGHFeatureAuthorized(mFeatureID = "2259")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CancelBillReasonSave entry)
        {
            CancelBillReasonModel model = new CancelBillReasonModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

         
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CancelBillReasonController", "0", "0", this.OperatorId, log_details);



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult CancelBillDashBoard()
        {
            CancelBillReasonModel model = new CancelBillReasonModel();
            List<CancelBillDashBoard> list = model.CancelBillDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelBillDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchCancelBIllReasonView(int CancelbillId)
        {
            CancelBillReasonModel model = new CancelBillReasonModel();
            List<CancelBillView> list = model.CancelBillView(CancelbillId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelBillView>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
