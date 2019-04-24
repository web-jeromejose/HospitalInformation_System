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
    public class AuthorizeCancelApproverController : BaseController
    {
       

        //
        // GET: /ITADMIN/AuthorizeCancelApprover/
        AccessRevisitApprovalModel bs = new AccessRevisitApprovalModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2053")]
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(AccessCancelApproverIdSave entry)
        {
            AccessRevisitApprovalModel model = new AccessRevisitApprovalModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.SaveCancelApproval(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "AuthorizeCancelApproverController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });



        }

        public JsonResult Select2Access(string id)
        {
            List<Select2EmployeeAccess> list = bs.Select2EmployeeAccessDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }



    }

    
}
