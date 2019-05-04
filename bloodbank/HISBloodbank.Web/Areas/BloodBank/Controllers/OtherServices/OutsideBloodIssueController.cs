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
    public class OutsideBloodIssueController : BaseController
    {
        //
        // GET: /BloodBank/OutsideBloodIssue/
        OutsideBloodIssueModel model = new OutsideBloodIssueModel();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BloodCategory()
        {
            List<BloodCategoryDAL> list = model.BloodCategory();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BloodCategoryDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult SDPLRCategory()
        {
            List<BloodCategoryDAL> list = model.SDPLRCategory();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BloodCategoryDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ComponentCategory()
        {
            List<ComponentCategoryDAL> list = model.ComponentCategory();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ComponentCategoryDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult Select2Hospital(string searchTerm, int pageSize, int pageNum)
        {
            var sel2data = model.Select2IssueHospital();
            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public ActionResult Select2OutSideBagperHospital(string searchTerm, int pageSize, int pageNum,int hospitalid)
        {
            var sel2data = model.Select2OutSideBagperHospital(hospitalid, searchTerm);
            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OutsideBloodIssueSave entry)
        {
            entry.operatorid = this.OperatorId;
            entry.StationId = this.StationId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        
    }
}
