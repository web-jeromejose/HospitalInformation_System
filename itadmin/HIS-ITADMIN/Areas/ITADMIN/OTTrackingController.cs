using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN
{
    public class OTTrackingController : BaseController
    {
        //
        // GET: /ITADMIN/OTTracking/
        ORTrackingModel bs = new ORTrackingModel();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ORTrackingDashBoard()
        {
            ORTrackingModel model = new ORTrackingModel();
            List<ORTrackingDashBoard> list = model.ORTrackingDashBoardList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ORTrackingDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult View(int OrId)
        {
            ORTrackingModel model = new ORTrackingModel();
            List<ORTRackingView> list = model.ORTrackingViewList(OrId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ORTRackingView>() }),
                ContentType = "application/json"
            };
            return result;

        }



        public ActionResult Select2PatientInfo(string searchTerm, int pageSize, int pageNum)
        {
            Select2PatientRepository list = new Select2PatientRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult CurrentRoomList(string searchTerm, int pageSize, int pageNum)
        {
            Select2CurrentRoomRepository list = new Select2CurrentRoomRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public ActionResult SurgeonList(string searchTerm, int pageSize, int pageNum)
        {
            Select2SurgeonListRepository list = new Select2SurgeonListRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult ORBEdList(string searchTerm, int pageSize, int pageNum)
        {
            Select2ORBedRepository list = new Select2ORBedRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult ITemList(string searchTerm, int pageSize, int pageNum)
        {
            Select2ItemProcedureRepository list = new Select2ItemProcedureRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        //public JsonResult CurrentRoomList(string id)
        //{
        //    List<Select2PatientInfo> list = bs.CurrentRoomDAL(id);
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

    }
}
