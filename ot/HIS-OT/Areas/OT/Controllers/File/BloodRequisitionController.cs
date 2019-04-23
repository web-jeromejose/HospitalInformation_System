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
using HIS_OT.Areas.OT.Models.File;

namespace HIS_OT.Areas.OT.Controllers
{
    public class BloodRequisitionController : BaseController
    {
        BloodRequisitionModel model = new BloodRequisitionModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2796")]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetBloodRequest(int id)
        {
            return Json(model.GetBloodRequestDAL(id), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Save(BloodRequestModel entry, List<BloodDetailModel> detail)
        {
            entry.OperatorId = this.OperatorId;
            var result = model.BloodRequestSave(entry, detail);
            int status = Convert.ToInt32(result.Flag);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(string.Concat("entry:", Newtonsoft.Json.JsonConvert.SerializeObject(entry), " detail:", Newtonsoft.Json.JsonConvert.SerializeObject(detail)));
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveBloodRequisition", "OT--" + "BloodRequisitionController", "0", "0", this.OperatorId, log_details);

            return Json(new Models.CustomMessage { Title = "Message...", Message = result.Message, ErrorCode = (status == 1 ? 1 : 0) });
        }

        public ActionResult ShowList()
        {
            List<BloodRequisition> list = model.GetBloodRequestDAL(this.StationId.ToString());
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BloodRequisition>() }),
                ContentType = "application/json"
            };
            return result;
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

        public ActionResult Select2GetDoctor(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2IPInvestigationDoctorRepository list = new Select2IPInvestigationDoctorRepository();
            list.Fetch(-1, 0);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2GetBloodItem(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2BloodItemRepository list = new Select2BloodItemRepository();
            list.Fetch(-1, 0);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}
