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
    public class PackageVisitController : BaseController
    {
        //
        // GET: /ITADMIN/PackageVisit/
        [IsSGHFeatureAuthorized(mFeatureID = "539")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PackageVisitDashboard(int Service)
        {
            PackageVisit model = new PackageVisit();
            List<PacakgeVisitDashBoard> list = model.PacakgeVisitDashBoard(Service);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PacakgeVisitDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult FetchPacakgeVisit(int Service,int PackageId)
        {
            PackageVisit model = new PackageVisit();
            List<PacakgeVisitView> list = model.PacakgeVisitView(Service,PackageId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PacakgeVisitView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult Select2Service(string searchTerm, int pageSize, int pageNum, int ServiceId)
        {
            Select2ServiceswithParamRespository list = new Select2ServiceswithParamRespository();
            list.Fetch(ServiceId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }




        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PackageVisitSave entry)
        {
            PackageVisit model = new PackageVisit();
            //entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
 

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "PackageVisitController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }
    }
}
