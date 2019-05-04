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
    public class SerologyResultsController : BaseController
    {
        //
        // GET: /BloodBank/SerologyResults/
        SerologyResultModel model = new SerologyResultModel();
        public ActionResult Index()
        {
            return View();
        }

 
        public ActionResult ShowList(ShowListParam para)
        {

            List<ShowListSerResult> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ShowListSerResult>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult Select2DonorRegList(string searchTerm, int pageSize, int pageNum)
        {
            var sel2data = model.SelectDonorNo(searchTerm);
            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }


        
        public ActionResult DonorRegList(string donorreg)
        {

            List<DonorRegDetailsDAL> list = model.DonorRegDetails(donorreg);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorRegDetailsDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Delete(string donorregno)
        {       
            bool status = model.Delete(donorregno);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(donorregno);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Delete", "BB--" + "SerologyResultsController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = "Donor Test Result has been deleted.", ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(SerologyResultSave entry)
        {
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "SerologyResultsController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = "Donor Test Result has been saved.", ErrorCode = status ? 1 : 0 });
        }


    }
}
