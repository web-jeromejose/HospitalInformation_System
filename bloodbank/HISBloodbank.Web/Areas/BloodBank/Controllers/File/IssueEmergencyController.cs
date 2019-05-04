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
    public class IssueEmergencyController : BaseController
    {
        //
        // GET: /BloodBank/IssuesEmergency/

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Dashboard()
        {
            IssueEmergencyModel model = new IssueEmergencyModel();
            List<IssueEmergency> list = model.GetIssueEmergencies();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IssueEmergency>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult GetIssue(int id)
        {
            IssueEmergencyModel model = new IssueEmergencyModel();
            IssueEmergencyInfo issue = model.GetIssueEmergencyById(id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(issue),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult AddIssue(IssueEmergencyVm vm)
        {
            IssueEmergencyModel model = new IssueEmergencyModel();
            vm.OperatorId = OperatorId.ToString();
            vm.StationId = StationId.ToString();
            // var issue = model.AddIssueEmergency(vm);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAvailableByBloodgroupId(int id)
        {
            IssueEmergencyModel model = new IssueEmergencyModel();
            List<IssueEmergencyAvailable> availables = model.GetIssueEmergencyAvailableByBloodgroupId(id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(availables),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult Select2BloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2BloodGroupRepository list = new Select2BloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2RptDoctors(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptDoctorsRepository list = new Select2RptDoctorsRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2BloodbankEmployee(string searchTerm, int pageSize, int pageNum)
        {
            Select2CrossmatchByRepository list = new Select2CrossmatchByRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(IssueEmergencySave entry)
        {
            IssueEmergencyModel model = new IssueEmergencyModel();
            entry.stationid = this.StationId;
            entry.operatorid = this.OperatorId;
            
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "IssueEmergencyController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
