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
    public class OPPackageModifyController : BaseController
    {
        //
        // GET: /ITADMIN/PackageVisit/
        [IsSGHFeatureAuthorized(mFeatureID = "1349")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult PacakgeVisitTestDashboard(int Pin)
        {
            PackageModifyVisit model = new PackageModifyVisit();
            List<PacakgeVisitTest> list = model.PacakgeVisitTest(Pin);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PacakgeVisitTest>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult PacakgeVisitProcedureDashboard(int Pin)
        {
            PackageModifyVisit model = new PackageModifyVisit();
            List<PacakgeVisitProcedure> list = model.PacakgeVisitProcedure(Pin);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PacakgeVisitProcedure>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PackageHeaderSave entry)
        {
            PackageModifyVisit model = new PackageModifyVisit();
            //entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OPPackageModifyController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        





    }
}
