using System;
using System.Collections.Generic;
using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class StationController : BaseController
    {
        //
        // GET: /ITADMIN/Station/
        [IsSGHFeatureAuthorized(mFeatureID = "525")]
        public ActionResult Index()
        {
            return View();
        }
        StationDetailsModel bs = new StationDetailsModel();
        public ActionResult StationTypeDashBoardList()
        {
            StationDetailsModel model = new StationDetailsModel();
            List<StationDashBoard> list = model.StationDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<StationDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult StationViewDetails(int Id)
        {
            StationDetailsModel model = new StationDetailsModel();
            List<StationDetailsViewModel> list = model.StationDetailsViewModellst(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<StationDetailsViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult Locationlst(string id)
        {
            List<LocationList> list = bs.LocationListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult StationTypList(string id)
        {
            List<LocationList> list = bs.StationTypeListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DepartmentList(string id)
        {
            List<LocationList> list = bs.DepartmentListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Save(StationDetailsSave entry)
        {
            StationDetailsModel model = new StationDetailsModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "StationController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }
}
