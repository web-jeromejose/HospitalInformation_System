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
using System.Web.Security;

namespace HIS_OT.Areas.OT.Controllers
{
    public class BloodDemandController : BaseController
    {
        BloodDemandModel model = new BloodDemandModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2797")]
        public ActionResult Index()
        {
            var identity = (FormsIdentity)User.Identity;
            var userData = identity.Ticket.UserData;
            string empId = userData.Split('|')[1];
            string empName = userData.Split('|')[2];
            ViewBag.empId = empId;
            ViewBag.empName = empName;
            return View();
        }

        public ActionResult ShowList()
        {
            List<BloodDemandDT> list = model.GetBloodDemandDAL(this.StationId.ToString());
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BloodDemandDT>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public JsonResult GetBloodDemand(int id)
        {
            return Json(model.GetBloodDemandDAL(id, this.StationId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Login(string id, string pass)
        {
            string ret;
            if (new User().IsUserValid(id, pass))
                ret = id;
            else
                ret = "0";

            return Json(ret, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Save(int bloodOrderId, int ipid, List<BloodDetailModel> detail)
        {
            var result = model.BloodDemandSave(this.OperatorId, this.StationId, bloodOrderId, ipid, detail);
            int status = Convert.ToInt32(result.Flag);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(string.Concat("bloodOrderId:", bloodOrderId, " detail:", Newtonsoft.Json.JsonConvert.SerializeObject(detail)));
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveBloodDemand", "OT--" + "BloodDemandController", "0", "0", this.OperatorId, log_details);

            return Json(new Models.CustomMessage { Title = "Message...", Message = result.Message, ErrorCode = (status == 1 ? 1 : 0) });
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

        public JsonResult Select2User(string id)
        {
            List<ItemList> Users = new User().GetUsers(id);
            var json = from l in Users
                       select new
                       {
                           text = l.ID + " - " + l.Name,
                           name = l.Name,
                           id = l.ID
                       };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}
