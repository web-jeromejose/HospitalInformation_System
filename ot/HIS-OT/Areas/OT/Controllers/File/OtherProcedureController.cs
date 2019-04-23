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
    public class OtherProcedureController : BaseController
    {
        [IsSGHFeatureAuthorized(mFeatureID = "1403")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList(MyFilterOtherProcedure filter)
        {
            filter.StationID = filter.CurrentStationID;
            filter.ID = -1;
            OtherProcedureModel model = new OtherProcedureModel();
            List<OtherProceduresOrder> list = model.ShowList(filter);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OtherProceduresOrder>() }),
                ContentType = "application/json"
            };


            ////log  
            //var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            //string log_details = log_serializer.Serialize(filter);
            //MasterLogs log = new MasterLogs();
            //bool logs = log.loginsert("ShowList", "OT--" + "OtherProcedureController", "0", "0", this.OperatorId, log_details);



            return result;
            
        }
        public JsonResult ShowSelected(MyFilterOtherProcedure filter)
        {
            filter.StationID = filter.CurrentStationID;
            OtherProcedureModel model = new OtherProcedureModel();
            List<OtherProceduresOrder> list = model.ShowList(filter);
            return Json(list ?? new List<OtherProceduresOrder>(), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OtherProceduresOrder entry)
        {
            OtherProcedureModel model = new OtherProcedureModel();
            entry.StationID = entry.CurrentStationID;
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "OtherProcedureController", "0", "0", this.OperatorId, log_details);
 

            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult Select2GetOtherProcedures(string searchTerm, int pageSize, int pageNum)
        {
            Select2GetOtherProceduresRepository list = new Select2GetOtherProceduresRepository();
            list.Fetch(searchTerm);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
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
        public ActionResult Select2Doctor(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2IPInvestigationDoctorRepository list = new Select2IPInvestigationDoctorRepository();
            list.Fetch(-1, 0);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }

}
