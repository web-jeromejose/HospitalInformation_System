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
    public class DepartmentSurgeryMappingController : BaseController
    {
        //
        // GET: /OT/DepartmentSurgeryMapping/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList()
        {
            DepartmentSurgeryMappingModel model = new DepartmentSurgeryMappingModel();
            List<MainListDepartmentSurgeryMapping> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListDepartmentSurgeryMapping>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(int Id)
        {
            DepartmentSurgeryMappingModel model = new DepartmentSurgeryMappingModel();
            List<Surgery> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Surgery>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult FindSurgery()
        {
            DepartmentSurgeryMappingModel model = new DepartmentSurgeryMappingModel();
            List<Surgery> list = model.FindSurery();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Surgery>() }),
                ContentType = "application/json"
            };
            return result;
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(MainListDepartmentSurgeryMapping entry)
        {
            DepartmentSurgeryMappingModel model = new DepartmentSurgeryMappingModel();
            bool status = model.Save(entry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "DepartmentSurgeryMappingController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }





        public ActionResult Select2SurgeryDepartment(string searchTerm, int pageSize, int pageNum)
        {
            Select2SurgeryDepartmentRepository list = new Select2SurgeryDepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetSurgery(string searchTerm, int pageSize, int pageNum)
        {
            Select2GetSurgeryRepository list = new Select2GetSurgeryRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


    }
}
