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
    public class CashDiscountDeptWiseController : BaseController
    {
        //
        // GET: /ITADMIN/CashDiscountDeptWise/
        DiscountTypeModel bss = new DiscountTypeModel();

        [IsSGHFeatureAuthorized(mFeatureID = "550")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CashDiscountDashboard(int DiscountType, int ServiceId)
        {
            CashDiscountDeptWiseModel model = new CashDiscountDeptWiseModel();
            List<CashDepartmentDashBoard> list = model.CashDepartmentDashBoard(DiscountType, ServiceId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CashDepartmentDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult CashDiscountDashboardItem(int DiscountType, int CompanyId, int CategoryId,int DiscountId, int ServiceId, int DepartmentId)
        {
            CashDiscountDeptWiseModel model = new CashDiscountDeptWiseModel();
            List<CashDiscountDeptWiseItem> list = model.CashDiscountDeptWiseItem(DiscountType, CompanyId, CategoryId, DiscountId, ServiceId, DepartmentId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CashDiscountDeptWiseItem>() }),
                ContentType = "application/json"
            };
            return result;

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

        public ActionResult Select2CashDiscountServices(string searchTerm, int pageSize, int pageNum, int DiscountType, int DiscountId, int CompanyId, int CategoryId)
        {
            Select2GetCashDiscountDeptWiseRespository list = new Select2GetCashDiscountDeptWiseRespository();
            list.Fetch(DiscountType,DiscountId,CompanyId,CategoryId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }
    }
}
