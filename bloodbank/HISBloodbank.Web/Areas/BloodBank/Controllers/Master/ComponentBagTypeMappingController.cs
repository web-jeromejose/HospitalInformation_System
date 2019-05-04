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
    public class ComponentBagTypeMappingController : BaseController
    {
        //
        // GET: /BloodBank/ComponentBagTypeMapping/

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult ShowList(int Id)
        {
            ComponentBagTypeMappingModel model = new ComponentBagTypeMappingModel();
            List<BagTypeMapping> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BagTypeMapping>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(int Id)
        {
            ComponentBagTypeMappingModel model = new ComponentBagTypeMappingModel();
            List<BagTypeMapping> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BagTypeMapping>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult GetBagTypeMapping(int componentid, int bagtypeid)
        {
            ComponentBagTypeMappingModel model = new ComponentBagTypeMappingModel();
            List<BagTypeMapping> list = model.GetBagTypeMapping(componentid, bagtypeid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BagTypeMapping>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(BagTypeMapping entry)
        {
            ComponentBagTypeMappingModel model = new ComponentBagTypeMappingModel();
            entry.operatorid = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }




        #region select2


        public ActionResult Select2ComponentBagType(string searchTerm, int pageSize, int pageNum, int componentid)
        {
            Select2ComponentBagTypeRepository list = new Select2ComponentBagTypeRepository();
            list.Fetch(componentid);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2ComponentName(string searchTerm, int pageSize, int pageNum, int bagtypeid)
        {
            Select2ComponentNameRepository list = new Select2ComponentNameRepository();
            list.Fetch(bagtypeid);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

    }
}
