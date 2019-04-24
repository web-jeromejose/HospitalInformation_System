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
    public class CashDiscountController : BaseController
    {
        //
        // GET: /ITADMIN/CashDiscount/
        CashDiscountModel bs = new CashDiscountModel();
        DiscountTypeModel bss = new DiscountTypeModel();

        [IsSGHFeatureAuthorized(mFeatureID = "549")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CashDiscountHeaderSave entry)
        {
            CashDiscountModel model = new CashDiscountModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CashDiscountController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult CashDiscountDashBoard(int DiscountType, int DiscountId, int CompanyId, int Categoryid)
        {
            CashDiscountModel model = new CashDiscountModel();
            List<CashDiscountDashBoard> list = model.CashDiscountDashBoard(DiscountType, DiscountId, CompanyId, Categoryid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CashDiscountDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult Select2Cat(string id)
        {
            List<Select2CategoryList> list = bs.Select2CategoryListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Select2Comp(string id)
        {
            List<Select2CompanyList> list = bss.Select2CompanyDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Select2DiscountType(string searchTerm, int pageSize, int pageNum, int DiscountType)
        {
            Select2GetDiscountTypeRespository list = new Select2GetDiscountTypeRespository();
            list.Fetch(DiscountType);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public ActionResult Select2Class(string searchTerm, int pageSize, int pageNum, int CompanyId)
        {
            Select2ClassRespository list = new Select2ClassRespository();
            list.Fetch(CompanyId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }
   
        
    }
}
