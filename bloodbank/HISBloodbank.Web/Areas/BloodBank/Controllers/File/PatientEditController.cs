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
    public class PatientEditController : BaseController
    {
        //
        // GET: /BloodBank/PatientEdit/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ShowList(ShowListParam para)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<DonorRegView> list = model.List(para.DonorRegFilter, para.Id, para.RowsPerPage, para.GetPage);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorRegView>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PatientEdit entry)
        {
            PatientEditModel model = new PatientEditModel();
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "PatientEditController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult ShowSelected(int Id)
        {
            PatientEditModel model = new PatientEditModel();
            List<PatientEdit> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PatientEdit>() }),
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

    }
}
