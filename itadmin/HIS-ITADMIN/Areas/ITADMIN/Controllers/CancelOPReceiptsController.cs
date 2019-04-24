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
using SGH.Encryption;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CancelOPReceiptsController : BaseController
    {
        //
        // GET: /ITADMIN/CancelOPReceipts/

        [IsSGHFeatureAuthorized(mFeatureID = "2251")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult CancelOPReceiptDashBoard(string FromDate, string ToDate)
        {
            CancelOPReceiptsModel model = new CancelOPReceiptsModel();
            List<CancelOPReceiptsDashboardModel> list = model.CancelOPReceiptsDashboardModel(FromDate, ToDate);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelOPReceiptsDashboardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult CancelOPReceiptView(string FromDate, int RegNo, int Service)
        {
            CancelOPReceiptsModel model = new CancelOPReceiptsModel();
            List<CancelOPReceiptView> list = model.CancelOPReceiptView(FromDate, RegNo, Service);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelOPReceiptView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult CancelOPReceiptMapping(DateTime FromDate, string ToDate, int RegNo, int Service, int opbillid, int SNO, string BillNo)
        {
            CancelOPReceiptsModel model = new CancelOPReceiptsModel();
            List<CancelOPReceiptsDashboardModel> list = model.CancelOPReceiptsMapping(FromDate, ToDate, RegNo, Service, opbillid, SNO, BillNo);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelOPReceiptsDashboardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CancelOpReceiptMappingSaveHeader entry)
        {
            CancelOPReceiptsModel model = new CancelOPReceiptsModel();
          //  entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CancelOPReceiptsController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }
}
