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
    public class BloodGroupMappingController : BaseController
    {
        //
        // GET: /BloodBank/BloodGroupMapping/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ShowList(int Id)
        {
            BloodGroupMappingModel model = new BloodGroupMappingModel();
            List<MainListBloodGrouping> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListBloodGrouping>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(List<BloodGroupMapping> entry)
        {
            BloodGroupMappingModel model = new BloodGroupMappingModel();
            List<BloodGroupMapping> reEntry = new List<BloodGroupMapping>();
            foreach (BloodGroupMapping re in entry)
            {
                re.operatorid = this.OperatorId;
                reEntry.Add(re);
            }
            bool status = model.Save(reEntry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult BloodGroupMappingSelected(int bloodgroop, int type, int componentid)
        {
            BloodGroupMappingModel model = new BloodGroupMappingModel();
            List<MasterBloodGroupMappingSelected> list = model.BloodGroupMappingSelected(bloodgroop, type, componentid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MasterBloodGroupMappingSelected>() }),
                ContentType = "application/json"
            };
            return result;
        }


        #region select2

        public ActionResult Select2BGMBloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2BGMBloodGroupRepository list = new Select2BGMBloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2BGMComponent(string searchTerm, int pageSize, int pageNum, int IdType)
        {
            Select2BGMComponentRepository list = new Select2BGMComponentRepository();
            list.Fetch(IdType);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion


    }
}
