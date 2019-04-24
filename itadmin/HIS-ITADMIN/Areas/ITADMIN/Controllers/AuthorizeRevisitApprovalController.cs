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
    public class AuthorizeRevisitApprovalController : BaseController
    {
        //
        // GET: /ITADMIN/AuthorizeRevisitApproval/
        AccessRevisitApprovalModel bs = new AccessRevisitApprovalModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2054")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(AccessIdSave entry)
        {
            AccessRevisitApprovalModel model = new AccessRevisitApprovalModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult Select2Access(string id)
        {
            List<Select2EmployeeAccess> list = bs.Select2EmployeeAccessDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
