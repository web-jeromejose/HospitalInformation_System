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
    public class DiscountTypesController : BaseController
    {
        //
        // GET: /ITADMIN/DiscountTypes/
        DiscountTypeModel bs = new DiscountTypeModel();

        [IsSGHFeatureAuthorized(mFeatureID = "548")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult DiscountTypeDashBoard(int DiscountType)
        {
            DiscountTypeModel model = new DiscountTypeModel();
            List<DiscountTypeDashBoard> list = model.DiscountTypeDashBoard(DiscountType);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DiscountTypeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult Select2Comp(string id)
        {
            List<Select2CompanyList> list = bs.Select2CompanyDAL(id);
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

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(DiscountTypeSave entry)
        {
            DiscountTypeModel model = new DiscountTypeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "DiscountTypesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult DumpSave(DumpDiscountTypeSave entry)
        {
            DiscountTypeModel model = new DiscountTypeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.DumpSave(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("DumpSave", "DiscountTypesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }

    }
}
