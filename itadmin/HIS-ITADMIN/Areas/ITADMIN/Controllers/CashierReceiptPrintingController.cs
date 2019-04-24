using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using DataLayer.Common;
using System.Web.Script.Serialization;
 
namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CashierReceiptPrintingController : BaseController
        {
        //
        // GET: /ITADMIN/CashierReceiptPrinting/
        CashierReceiptPrintingModel model = new CashierReceiptPrintingModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2780")]
        public ActionResult Index()
        {
            return View();
        }
  
        public ActionResult Dashboard(string receiptno)
        {

            List<ReceiptDetailsVM> list = model.ReceiptDetails(receiptno);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReceiptDetailsVM>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(string id)
        {
           
           
            string status = model.SAVE(id, this.OperatorId);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(id);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CashierReceiptPrintingController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message ="Done"});


        }





    }
}
