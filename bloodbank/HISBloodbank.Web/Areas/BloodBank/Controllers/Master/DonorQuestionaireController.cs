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
    public class DonorQuestionaireController : BaseController
    {
        //
        // GET: /BloodBank/DonorQuestionaire/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList(int Id)
        {
            DonorQuestionaireModel model = new DonorQuestionaireModel();
            List<DonorQuestionaires> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorQuestionaires>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(int Id)
        {
            DonorQuestionaireModel model = new DonorQuestionaireModel();
            List<DonorQuestionaires> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorQuestionaires>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(DonorQuestionaires entry)
        {
            DonorQuestionaireModel model = new DonorQuestionaireModel();
            entry.operatorid = this.OperatorId;
            if (entry.Action != 1) entry.modifiedby = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #region select2

        public ActionResult Select2BloodGroupDepartment(string searchTerm, int pageSize, int pageNum)
        {
            Select2BloodGroupDepartmentRepository list = new Select2BloodGroupDepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion


    }
}
