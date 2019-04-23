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
    public class IPDrugOrdersController : BaseController
    {

        [IsSGHFeatureAuthorized(mFeatureID = "2802")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList(int CurrentStationID)
        {
            IPDrugOrdersModel model = new IPDrugOrdersModel();
            List<MainListIPDrugOrder> list = model.List(CurrentStationID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListIPDrugOrder>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(int Id)
        {
            IPDrugOrdersModel model = new IPDrugOrdersModel();
            List<Drugorder> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Drugorder>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(Drugorder entry)
        {
            IPDrugOrdersModel model = new IPDrugOrdersModel();
            entry.StationID = entry.CurrentStationID;
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveDrugOrder", "OT--" + "IPDrugOrdersController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        public ActionResult DrugAllergiesList(int IPID)
        {
            IPDrugOrdersModel model = new IPDrugOrdersModel();
            List<M_Generic> list = model.DrugAllergiesList(IPID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<M_Generic>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult IssuedDrugList(int orderid)
        {
            IPDrugOrdersModel model = new IPDrugOrdersModel();
            List<IssuedDrugs> list = model.IssuedDrugList(orderid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IssuedDrugs>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult SearchDrugs(string search)
        {
            IPDrugOrdersModel model = new IPDrugOrdersModel();
            List<SearchDrugEntity> list = model.SearchDrugs(search);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SearchDrugEntity>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult select2PIN(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2InpatientsRepositoryPIN list = new Select2InpatientsRepositoryPIN();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult select2Name(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2InpatientsRepositoryName list = new Select2InpatientsRepositoryName();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult select2BedNo(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2InpatientsRepositoryBedNo list = new Select2InpatientsRepositoryBedNo();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult select2Doctor(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2InpatientsRepositoryDoctor list = new Select2InpatientsRepositoryDoctor();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }
}
