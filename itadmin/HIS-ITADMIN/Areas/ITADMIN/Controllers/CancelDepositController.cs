using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using DataLayer.ITAdmin.Model;


namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CancelDepositController : BaseController
    {
        //
        // GET: /ITADMIN/CancelDeposit/
        TransferDepositTypeModel bs = new TransferDepositTypeModel();

        [IsSGHFeatureAuthorized(mFeatureID = "1634")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CancelDepositHeaderSave entry)
        {
            CancelDepositModel model = new CancelDepositModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CancelDepositController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult FetchCancelAdmissionDate(int IPID)
        {
            CancelDepositModel model = new CancelDepositModel();
            List<CancelDepositDashBoard> list = model.CancelDepositDashBoardList(IPID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelDepositDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult CancelReasonList(string id)
        {
            List<ReasonListModel> list = bs.ReasonListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FetchCancelPatientInformation(int IPID)
        {
            CancelDepositModel model = new CancelDepositModel();
            List<PatientCancelInformation> list = model.PatientCancelInformationView(IPID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PatientCancelInformation>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult Select2AdminssionDate(string searchTerm, int pageSize, int pageNum, int Id)
        {
            Select2GetAdmissionDateRespository list = new Select2GetAdmissionDateRespository();
            list.Fetch(Id);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };


        }
    


    }
}
