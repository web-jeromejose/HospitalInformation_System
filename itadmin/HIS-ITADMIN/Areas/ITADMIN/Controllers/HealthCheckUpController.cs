using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class HealthCheckUpController : BaseController
    {
        //
        // GET: /ITADMIN/HealthCheckUp/
        HealthCheckupModel bs = new HealthCheckupModel();
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(HealthCheckUpHeaderSave entry)
        {
            HealthCheckupModel model = new HealthCheckupModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "HealthCheckUpController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ComputeItemPrice(ComputeItemHeaderPrice entry)
        {
            HealthCheckupModel model = new HealthCheckupModel();
            //entry.OperatorID = this.OperatorId;
            bool status = model.ComputeItemPrice(entry);
            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("ComputeItemPrice", "HealthCheckUpController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public ActionResult View(int HealthCheckId)
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<FetchHealthCheckupDetails> list = model.FetchHealthCheckupDetails(HealthCheckId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FetchHealthCheckupDetails>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult HealthCheckupDashboard()
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<HealthCheckupDashBoardModel> list = model.HealthCheckupDashBoardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<HealthCheckupDashBoardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult InvestigationTempDisplay()
        {

            var ip = LocalIPAddress();
            HealthCheckupModel model = new HealthCheckupModel();
            List<InvestigationTempDisplay> list = model.InvestigationTempDisplay();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<InvestigationTempDisplay>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult DeptConsulTempDisplay()
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<ConsulDepartTempDisplay> list = model.ConsulDepartTempDisplay();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ConsulDepartTempDisplay>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult HealthProcedureTempDisplay()
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<HealthProcedureTempDisplay> list = model.HealthProcedureTempDisplay();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<HealthProcedureTempDisplay>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult InvestigationList()
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<InvestigationList> list = model.InvestigationList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<InvestigationList>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult FetchHealthCheckupDetails(int HealthCheckupId)
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<FetchHealthCheckupDetails> list = model.FetchHealthCheckupDetails(HealthCheckupId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FetchHealthCheckupDetails>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult ConsulationDeptList()
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<ConsultationDept> list = model.ConsultationDept();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ConsultationDept>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult OtherProcedureList()
        {
            HealthCheckupModel model = new HealthCheckupModel();
            List<OtherProceduresList> list = model.OtherProceduresList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OtherProceduresList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult CompanyList(string id)
        {
            List<ListCompModel> list = bs.CompanyListDAL(id);
            return Json(list,JsonRequestBehavior.AllowGet);
        }

        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bs.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Select2Sample(string searchTerm, int pageSize, int pageNum)
        {
            Select2SampleRepository list = new Select2SampleRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        //public JsonResult SampleList(string id)
        //{
        //    List<ListSampleModel> list = bs.SampleListDAL(id);
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

    
    }
}
