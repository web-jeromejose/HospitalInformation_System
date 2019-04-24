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
    public class PatientOrderCancellationController : BaseController
    {
        //
        // GET: /ITADMIN/PatientOrderCancellation/
        [IsSGHFeatureAuthorized(mFeatureID = "1582")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult FetchCancelPatientOrderInformation(int IPID)
        {
            PatientOrderCancelationModel model = new PatientOrderCancelationModel();
            List<PatientCancelOrderInformation> list = model.PatientCancelInformationView(IPID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PatientCancelOrderInformation>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchPatientOrderCancel(int Id)
        {
            PatientOrderCancelationModel model = new PatientOrderCancelationModel();
            List<CancelPatientOrderDashBoard> list = model.CancelPatientOrderDashBoard(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelPatientOrderDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PatientOrderHeaderSave entry)
        {
            PatientOrderCancelationModel model = new PatientOrderCancelationModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "PatientOrderCancellationController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
