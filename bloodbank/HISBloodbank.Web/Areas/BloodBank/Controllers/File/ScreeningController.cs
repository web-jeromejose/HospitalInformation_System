using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DataLayer;
using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Areas.BloodBank.Controllers;
using HIS_BloodBank.Models;
using HIS_BloodBank.Controllers;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class ScreeningController : BaseController
    {
        //
        // GET: /BloodBank/Screening/
        ScreeningModel model = new ScreeningModel();

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ScreeningDashboard()
        {

            List<ScreeningDashboard> list = model.ScreeningDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ScreeningDashboard>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ComponentDetails(string bagid)
        {

            List<Select2> list = model.Select2ComponentDetails(bagid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Select2>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ScreenResultDetails(string bagid)
        {

            List<Select2> list = model.Select2ScreenResultsDetails(bagid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Select2>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult Select2CrossmatchIPBloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2CrossmatchIPBloodGroupRepository list = new Select2CrossmatchIPBloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2ScreenResults(string searchTerm, int pageSize, int pageNum)
        {
            var sel2data = model.Select2ScreenResults(searchTerm);

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public ActionResult Select2Component(string searchTerm, int pageSize, int pageNum)
        {
            var sel2data = model.Select2Component(searchTerm);

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ScreenSave entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.stationId = this.StationId;
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "ScreeningController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
