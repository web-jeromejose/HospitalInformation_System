using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CSTMarkUpController : BaseController
    {
        //
        // GET: /ITADMIN/CSTMarkUp/

        CSTMarkupModel bs = new CSTMarkupModel();

        [IsSGHFeatureAuthorized(mFeatureID = "544")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(HeaderMarkUpSave entry)
        {
            CSTMarkupModel model = new CSTMarkupModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CSTMarkUpController", "0", "0", this.OperatorId, log_details);



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult Select2Company(string id)
        {
            List<ListCompanyModel> list = bs.Select2CompanyDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Select2Category(string searchTerm, int pageSize, int pageNum, int CompanyId)
        {
            Select2GetCategoryespository list = new Select2GetCategoryespository();
            list.Fetch(CompanyId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult DepartlvlMarkUp()
        {
            CSTMarkupModel model = new CSTMarkupModel();
            List<DepartLvlMarkUp> list = model.DepartlvlMarkUp();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DepartLvlMarkUp>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult RangemarkupDashboard()
        {
            CSTMarkupModel model = new CSTMarkupModel();
            List<RangemarkupDashboard> list = model.RangemarkupDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RangemarkupDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public ActionResult OldRangemarkupDashboard()
        {
            CSTMarkupModel model = new CSTMarkupModel();
            List<RangemarkupDashboard> list = model.OldRangemarkupDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RangemarkupDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }



        public JsonResult GetMaxRangeMarkUp()
        {
            CSTMarkupModel _MaxRange = new CSTMarkupModel();
            List<GetMaxRangeMarkUp> MaxRangeMarkup = _MaxRange.GetMaxRangeMarkUp();
            return Json(MaxRangeMarkup ?? new List<GetMaxRangeMarkUp>(), JsonRequestBehavior.AllowGet);

        }

     

    }
}
