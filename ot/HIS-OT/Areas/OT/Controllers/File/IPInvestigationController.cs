using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
using HIS.Controllers;

namespace HIS_OT.Areas.OT.Controllers
{
    [Authorize]
    public class IPInvestigationController : BaseController
    {
        [IsSGHFeatureAuthorized(mFeatureID = "253")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList(MyFilterIPInvestigation filter)
        {
            IPInvestigationModel model = new IPInvestigationModel();
            filter.StationId = filter.CurrentStationID;
            List<TestRequisition> list = model.ShowList(filter);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TestRequisition>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public JsonResult ShowSelected(int Id)
        {
            IPInvestigationModel model = new IPInvestigationModel();
            List<TestRequisition> list = model.ShowSelected(Id);
            return Json(list ?? new List<TestRequisition>(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult SampleCollectionResultList(int Id)
        {
            IPInvestigationModel model = new IPInvestigationModel();
            List<SampleCollectionResult> list = model.SampleCollectionResultList(Id);
            return Json(list ?? new List<SampleCollectionResult>(), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(TestRequisition entry)
        {
            IPInvestigationModel model = new IPInvestigationModel();
            entry.SourceStID = entry.CurrentStationID;
            entry.TransDoneFromStationID = entry.CurrentStationID;
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "IPInvestigationController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Collect(TestRequisition entry)
        {
            IPInvestigationModel model = new IPInvestigationModel();
            entry.Action = 100;
            entry.SourceStID = entry.CurrentStationID;
            entry.TransDoneFromStationID = entry.CurrentStationID;
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CollectUndo(TestRequisition entry)
        {
            IPInvestigationModel model = new IPInvestigationModel();
            entry.Action = 99; 
            entry.SourceStID = entry.CurrentStationID;
            entry.TransDoneFromStationID = entry.CurrentStationID;
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }



        public ActionResult Select2GetPIN(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryPin list = new Select2GetPinNameBedNoRepositoryPin();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetName(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryName list = new Select2GetPinNameBedNoRepositoryName();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetBedNo(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryBedNo list = new Select2GetPinNameBedNoRepositoryBedNo();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2IPInvestigationDoctor(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2IPInvestigationDoctorRepository list = new Select2IPInvestigationDoctorRepository();
            list.Fetch(-1, 0);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2GetLabPatientStatus(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetLabPatientStatusRepository list = new Select2GetLabPatientStatusRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetAllTest(string searchTerm, int pageSize, int pageNum)
        {
            Select2GetAllTestRepository list = new Select2GetAllTestRepository();
            list.Fetch(1);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetProfileTest(string searchTerm, int pageSize, int pageNum)
        {
            Select2GetAllTestRepository list = new Select2GetAllTestRepository();
            list.Fetch(0);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }        




    }
}
