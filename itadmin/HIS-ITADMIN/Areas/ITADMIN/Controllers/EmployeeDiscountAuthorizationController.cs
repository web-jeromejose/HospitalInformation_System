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
    public class EmployeeDiscountAuthorizationController : BaseController
    {
        //
        // GET: /ITADMIN/EmployeeDiscountAuthorization/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Select2DiscountType(string searchTerm, int pageSize, int pageNum, int DiscountType)
        {
            Select2GetEmpAuthorityDiscountRespository list = new Select2GetEmpAuthorityDiscountRespository();
            list.Fetch(DiscountType);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public ActionResult EmpAuthority(int DiscountId, int IPOPTypeId)
        {
            EmployeeDiscountAuthorizationModel model = new EmployeeDiscountAuthorizationModel();
            List<EmpAuthorityView> list = model.EmpAuthorityView(DiscountId, IPOPTypeId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<EmpAuthorityView>() }),
                ContentType = "application/json"
            };
            return result;

        }



        public ActionResult EmployeeAuthorizationDashboard()
        {
            EmployeeDiscountAuthorizationModel model = new EmployeeDiscountAuthorizationModel();
            List<EmpDiscAutDashboard> list = model.EmpDiscAutDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<EmpDiscAutDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(EmpAuthorityHeaderSave entry)
        {
            EmployeeDiscountAuthorizationModel model = new EmployeeDiscountAuthorizationModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "EmployeeDiscountAuthorizationController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
