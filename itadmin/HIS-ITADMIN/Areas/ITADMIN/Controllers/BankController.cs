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
    public class BankController : BaseController
    {
        //
        // GET: /ITADMIN/Bank/
        MasterModel model = new MasterModel();

        public ActionResult Index()
        {//this should be in HR PAYROLL - jan 2019
            return View();
        }


        public ActionResult BankDashboard(string deptid, string serviceid)
        {

            List<BANKVm> list = model.GetBankMaster();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BANKVm>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult BankDetails(  string bankid)
        {

            List<bankbackupVM> list = model.GetBankDetails(bankid);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<bankbackupVM>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BankMasterSave(BANKSaveVm entry)
        {

            entry.OperatorID = this.OperatorId;
             bool status = model.BankMasterSave(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("BankMasterSave", "BankController", "0", "0", this.OperatorId, "  " + entry.ID);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BankMasterNew(BANKSaveVm entry)
        {

            entry.OperatorID = this.OperatorId;
            bool status = model.BankMasterNew(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("BankMasterNew", "BankController", "0", "0", this.OperatorId, "  "  );

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BankMasterDelete(BANKSaveVm entry)
        {
            entry.OperatorID = this.OperatorId;
            bool status = model.BankMasterDelete(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("BankMasterDelete", "BankController", "0", "0", this.OperatorId, "  " + entry.ID);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BankDetailsNew(bankbackupVM entry)
        {

            entry.operatorid = this.OperatorId;
            bool status = model.BankDetailsNew(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("BankDetailsNew", "BankController", "0", "0", this.OperatorId, "  " );

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BankDetailsDelete(bankbackupVM entry)
        {
            entry.operatorid = this.OperatorId;
            bool status = model.BankDetailsDelete(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("BankMasterDelete", "BankController", "0", "0", this.OperatorId, "  " + entry.ID);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
           [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BankDetailsUpdate(bankbackupVM entry)
        {
            entry.operatorid = this.OperatorId;
            bool status = model.BankDetailsUpdate(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("BankMasterDelete", "BankController", "0", "0", this.OperatorId, "  " + entry.ID);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        

    }
}
