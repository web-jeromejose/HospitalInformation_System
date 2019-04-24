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

 


using DataLayer.ITAdmin.Data;
using SGH;
 


namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CancelOPDiscountApprovalController : BaseController
    {
        //
        // GET: /ITADMIN/CancelOPDiscountApproval/
        [IsSGHFeatureAuthorized(mFeatureID = "2322")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FetchCanlOPDiscount(int RegNo)
        {
            CancelOPDiscountApprvlModel model = new CancelOPDiscountApprvlModel();
            List<CancelOPDiscountApprvl> list = model.OpDiscountCancelApprovalView(RegNo);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelOPDiscountApprvl>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ReleaseEmpVacationHeaderSave entry)
        {
            SghUtilitiesDB DB = new SghUtilitiesDB();

            CancelOPReceiptsModel model = new CancelOPReceiptsModel();
            //  entry.OperatorId = this.OperatorId;
            bool status = DB.SaveCancelOPDiscountApproval(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CancelOPDiscountApprovalController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message =  "Successfully Updated.", ErrorCode = status ? 1 : 0 });


        }


        /* START
       * Cancel OP Discount Approval
       * JFJ Nov 21 2016
       */

        /*
              frmCancelOPDiscount
         * 
            select top 100 *  from patient where Registrationno =14614  order by SGHDateTime asc
            select id as id, visitdate as visitdate, reason as reason, 'active' status from opdiscountapproval where  regno =14614 and deleted = 0
            select * from OPDiscountApproval where RegNo = 14614 and id in (702819,707005,716866,721804,724575,933584) --update this deleted = 1

          */



        /* END
      * Cancel OP Discount Approval
      * JFJ Nov 21 2016
      */



    }
}
