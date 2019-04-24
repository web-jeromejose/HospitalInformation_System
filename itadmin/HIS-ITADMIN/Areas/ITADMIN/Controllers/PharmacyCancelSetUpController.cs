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
    public class PharmacyCancelSetUpController : BaseController
    {
        //
        // GET: /ITADMIN/PharmacyCancelSetUp/
      
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PharmacyCancelDashBoard()
        {
            PharmacyCancelSetupModel model = new PharmacyCancelSetupModel();
            List<PharmacyCancelDashBoard> list = model.PharmacyCancelDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PharmacyCancelDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchPharmacyView(int StationId)
        {
            PharmacyCancelSetupModel model = new PharmacyCancelSetupModel();
            List<PharmacyCancelView> list = model.PharmacyCancelView(StationId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PharmacyCancelView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PharmacySave entry)
        {
            PharmacyCancelSetupModel model = new PharmacyCancelSetupModel();
        //    entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "PharmacyCancelSetUpController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());




            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
