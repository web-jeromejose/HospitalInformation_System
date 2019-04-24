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
    public class BillPrefixController : BaseController
    {
        //
        // GET: /ITADMIN/BillPrefix/
        BillPrefixModel bs = new BillPrefixModel();

        [IsSGHFeatureAuthorized(mFeatureID = "1285")]
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(BillPrefixSave entry)
        {
            BillPrefixModel model = new BillPrefixModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
             
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "BillPrefixController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult BillPrefixDashBoard()
        {
            BillPrefixModel model = new BillPrefixModel();
            List<BillPrefixDashBoard> list = model.BillPrefixDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BillPrefixDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult Select2Stations(string id)
        {
            List<ListStation> list = bs.Select2Stations(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult FetchBillPrefix(int StationId, string Name, string BillType)
        {
            BillPrefixModel model = new BillPrefixModel();
            List<BillPrefixView> list = model.BillPrefixView(StationId, Name, BillType);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BillPrefixView>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
