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
    [Authorize]
    public class IPDrugReturnsController : BaseController
    {
        IPDrugReturns model = new IPDrugReturns();


        [IsSGHFeatureAuthorized(mFeatureID = "2803")]
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
            List<DrugReturnDT> list = model.GetDrugReturnList(this.StationId.ToString());
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DrugReturnDT>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public JsonResult GetDrugReturn(int id)
        {
            return Json(model.GetDrugReturn(id, this.StationId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDrugs(int orderId)
        {
            List<DrugModelDT> list = model.GetDrugs(orderId, this.StationId.ToString());
            return Json(list ?? new List<DrugModelDT>(), JsonRequestBehavior.AllowGet);
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
        public JsonResult Cancel(int drugReturnId)
        {
            string message = model.Cancel(drugReturnId);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(drugReturnId);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("CancelDrugReturn", "OT--" + "IPDrugReturnsController", "0", "0", this.OperatorId, log_details);

            return Json(
                new Response()
                {
                    Message = message
                },
                  JsonRequestBehavior.AllowGet
                );
        }

        [HttpPost]
        public JsonResult Save(List<DrugItemModel> entry, int ipid, int doctorId, int drugReturnId, int drugOrderId)
        {
            string message = model.Save(entry, this.OperatorId.ToString(), drugReturnId, drugOrderId, ipid, doctorId);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(string.Concat("DRetId:", drugReturnId, " DOrdId:", drugOrderId, " IPID:", ipid, " DocId:", doctorId, Newtonsoft.Json.JsonConvert.SerializeObject(entry)));
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveDrugReturn", "OT--" + "IPDrugReturnsController", "0", "0", this.OperatorId, log_details);

            return Json(
                new Response()
                {
                    Message = message
                },
                  JsonRequestBehavior.AllowGet
                );
        }

        public ActionResult Select2GetPIN(string searchTerm, int pageSize, int pageNum, int type)
        {
            PatientRepository list = new PatientRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Page(searchTerm, pageSize, pageNum, true),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2GetName(string searchTerm, int pageSize, int pageNum, int type)
        {
            PatientRepository list = new PatientRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Page(searchTerm, pageSize, pageNum, false),
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

        public ActionResult Select2GetOrders(string searchTerm, int pageSize, int pageNum, int ipid)
        {
            var result = model.OrderNoList(ipid, searchTerm);
            var data = new
            {
                Results = result,
                Total = result.Count
            };
            return new JsonpResult
            {
                Data = data,
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
