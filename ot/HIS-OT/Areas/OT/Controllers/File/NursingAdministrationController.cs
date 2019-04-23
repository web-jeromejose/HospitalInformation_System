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
    public class NursingAdministrationController : BaseController
    {
        //
        // GET: /OT/NursingAdministration/
        NursingAdministrationModel model = new NursingAdministrationModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2795")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList()
        {
            int statid = this.StationId;
            List<NursingAdministration_ShowList> list = model.ShowList(statid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdministration_ShowList>() }),
                ContentType = "application/json"
            };
            return result;

        }

       
        public ActionResult GetInpatient(int ipid)
        {
         
            List<NursingAdministration_PatientView> list = model.GetInpatientDAL(ipid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdministration_PatientView>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult GetOrderList(int OrderId)
        {

            List<NursingAdministration_GetOrderList> list = model.GetOrderList(OrderId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdministration_GetOrderList>() }),
                ContentType = "application/json"
            };
            return result;
 
        }

        public ActionResult BedsideItems()
        {

            List<NursingAdministration_BedsideProcedures> list = model.BedsideProcedures();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdministration_BedsideProcedures>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult PatientList(string Registrationno)
        {

            List<NursingAdministration_PatientList> list = model.PatientList(Registrationno);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdministration_PatientList>() }),
                ContentType = "application/json"
            };
            return result;

        }
 
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CancelOrder(int OrderId)
        {
            
            int OperatorId = this.OperatorId;
            bool status = model.CancelOrder(OrderId, OperatorId);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(OrderId);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("CancelOrder", "OT--" + "NursingAdministrationController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }
 
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveNursingAdmin(NursingAdministration_Save entry)
        {

            bool status = false;
            try
            {
                entry.operatorid = this.OperatorId;
                entry.stationid = this.StationId;
                  status = model.SaveNursingAdmin(entry);

                ////log  
                var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
                string log_details = log_serializer.Serialize(entry);
                MasterLogs log = new MasterLogs();
                bool logs = log.loginsert("SaveNursingAdmin", "OT--" + "NursingAdministrationController", "0", "0", this.OperatorId, log_details);


                return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

            }
            catch (Exception e)
            {
                return Json(new CustomMessage { Title = "Message...", Message = e.InnerException.Message, ErrorCode = status ? 1 : 0 });
            }
 

        }
        public ActionResult DoctorList(string str)
        {

            List<Select2Ajax> list = model.DoctorList(str);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Select2Ajax>() }),
                ContentType = "application/json"
            };
            return result;

        }

        






    }
}
