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
   // [Authorize]
    public class OTSchedulerController : BaseController
    {
        [IsSGHFeatureAuthorized(mFeatureID = "128")]
        public ActionResult Index()
        {
           
            return View();
        }


        public ActionResult GetAllowedDoctor()
        {
            OTSchedulerModel model = new OTSchedulerModel();
            OperatorId = this.OperatorId;
            List<DoctorListStatusModel> AllowedID = model.DoctorListStatusModel(OperatorId);
            return Json(AllowedID ?? new List<DoctorListStatusModel>(), JsonRequestBehavior.AllowGet);

        }



        public ActionResult ShowList(OTScheduleFilter filter)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            List<OTSchedule> list = model.List(filter);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OTSchedule>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(OTScheduleFilter filter)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            List<OTSchedule> list = model.List(filter);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OTSchedule>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowCalendar(OTScheduleFilter filter)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            List<Scheduler> list = model.ListCalendar(filter);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Scheduler>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult PatientFilterResults(PatientFilter filter)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            List<PatientFilterResults> list = model.PatientFilterResults(filter);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PatientFilterResults>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public JsonResult ValidateDate(string id , string df, string dt)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            string s = model.ValidateDateDAL(id,df, dt);
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        //[IsSGHFeatureAuthorized(mFeatureID = "128", mFunctionId = "2")]
        //[AcceptVerbs(HttpVerbs.Post)]
        //public ActionResult Save(OTSchedule entry)
        //{

        //    OTSchedulerModel model = new OTSchedulerModel();
        //    entry.OperatorID = this.OperatorId;
        //    bool status = model.Save(entry);
        //    return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        //}

        [IsSGHFeatureAuthorized(mFeatureID = "128", mFunctionId = "22")]
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Confirm(OTSchedule entry)
        {
            //data: [{ id: 1, text: 'Reserve' },
            //       { id: 2, text: 'Confirm' }],
            entry.ReservedConfirmedId = 2;
            entry.ReservedConfirmed = 2;
            OTSchedulerModel model = new OTSchedulerModel();
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Confirm", "OT--" + "OTSchedulerController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        [IsSGHFeatureAuthorized(mFeatureID = "128", mFunctionId = "21")]
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Reserve(OTSchedule entry)
        {
            //// entry=   V: 0
            //            A: 1 
            //            E: 2
            //            D: 3
            //data: [{ id: 1, text: 'Reserve' },
            //       { id: 2, text: 'Confirm' }],
            entry.ReservedConfirmedId = 1;
            entry.ReservedConfirmed = 1;
            OTSchedulerModel model = new OTSchedulerModel();
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Reserve", "OT--" + "OTSchedulerController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        //------------------------------NoPermission 
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ConfirmNoPermission(OTSchedule entry)
        {
            //data: [{ id: 1, text: 'Reserve' },
            //       { id: 2, text: 'Confirm' }],
            entry.ReservedConfirmedId = 2;
            entry.ReservedConfirmed = 2;
            OTSchedulerModel model = new OTSchedulerModel();
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("ConfirmNoPermission", "OT--" + "OTSchedulerController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        //------------------------------NoPermission 
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ReserveNoPermission(OTSchedule entry)
        {
            //// entry=   V: 0
            //            A: 1 
            //            E: 2
            //            D: 3
            //data: [{ id: 1, text: 'Reserve' },
            //       { id: 2, text: 'Confirm' }],
            entry.ReservedConfirmedId = 1;
            entry.ReservedConfirmed = 1;
            OTSchedulerModel model = new OTSchedulerModel();
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("ReserveNoPermission", "OT--" + "OTSchedulerController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [IsSGHFeatureAuthorized(mFeatureID = "128", mFunctionId = "49")]
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CheckPermissionNewButton()
        { 
             int OperatorID = this.OperatorId;

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(OperatorID);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("CheckPermissionNewButton", "OT--" + "OTSchedulerController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = "message", ErrorCode = 1   });
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


        public ActionResult Select2GetPINParam(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinRepositoryParam list = new Select2GetPinRepositoryParam();
            list.Fetch(type);
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

        public ActionResult Select2GetNameParam(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryPramName list = new Select2GetPinNameBedNoRepositoryPramName();
            list.Fetch(type);
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

        public ActionResult Select2GetAnaesthesia(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetAnaesthesiaRepository list = new Select2GetAnaesthesiaRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2SelectedSurgery(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedSurgeryRepository list = new Select2SelectedSurgeryRepository();
            list.Fetch(SurgeryRecordId, IsSelected, true, searchTerm);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedSurgeon(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedSurgeonRepository list = new Select2SelectedSurgeonRepository();
            list.Fetch(SurgeryRecordId, IsSelected, true);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedAsstSurgeon(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedAsstSurgeonRepository list = new Select2SelectedAsstSurgeonRepository();
            list.Fetch(SurgeryRecordId, IsSelected, true);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedAnaesthetist(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedAnaesthetistRepository list = new Select2SelectedAnaesthetistRepository();
            list.Fetch(SurgeryRecordId, IsSelected, true);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedEquipment(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedEquipmentRepository list = new Select2SelectedEquipmentRepository();
            list.Fetch(SurgeryRecordId, IsSelected, true,searchTerm);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetOperatingTheatres(string searchTerm, int pageSize, int pageNum, int type, int StationId)
        {
            Select2GetOperatingTheatresRepository list = new Select2GetOperatingTheatresRepository();
            list.Fetch(StationId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2Country(string searchTerm, int pageSize, int pageNum)
        {
            Select2CountryRepository list = new Select2CountryRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Cities(string searchTerm, int pageSize, int pageNum)
        {
            Select2CitiesRepository list = new Select2CitiesRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Gender(string searchTerm, int pageSize, int pageNum)
        {
            Select2GenderRepository list = new Select2GenderRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }




    }


}
