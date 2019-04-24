using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using DataLayer;
using HIS.Controllers;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class TransOrderController : BaseController
    {
        //
        // GET: /ITADMIN/TransOrder/

        [IsSGHFeatureAuthorized(mFeatureID = "1971")]
        public ActionResult Index()
        {
            return View();
        }
        
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Process(CreateTransOrder entry)
        {
            TransOrderModel model = new TransOrderModel();
            //entry.operatorid = this.OperatorId;
            bool status = model.Process(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "TransOrderController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }
}
