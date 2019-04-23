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
    public class DepartmentScheduleController : BaseController
    {
        //
        // GET: /OT/DepartmentSchedule/

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult ShowList()
        {
            DepartmentScheduleModel model = new DepartmentScheduleModel();
            List<DeptScheduleDay> list = model.List(-1);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DeptScheduleDay>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public JsonResult ShowSelected(int Id)
        {
            DepartmentScheduleModel model = new DepartmentScheduleModel();
            List<DeptScheduleDay> list = model.List(Id);
            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(Id);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("ShowSelected", "OT--" + "DepartmentScheduleController", "0", "0", this.OperatorId, log_details);


            return Json(list ?? new List<DeptScheduleDay>(), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(List<DeptScheduleDay> entry)
        {
            DepartmentScheduleModel model = new DepartmentScheduleModel();
            List<DeptScheduleDay> reEntry = new List<DeptScheduleDay>();
            foreach (DeptScheduleDay re in entry)
            {
                re.Operatorid = this.OperatorId;
                re.Stationid = this.StationId;
                reEntry.Add(re);
            }
            bool status = model.Save(reEntry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "DepartmentScheduleController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        public ActionResult Select2DeptSchedDepartment(string searchTerm, int pageSize, int pageNum)
        {
            Select2DeptSchedDepartmentRepository list = new Select2DeptSchedDepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }
}
