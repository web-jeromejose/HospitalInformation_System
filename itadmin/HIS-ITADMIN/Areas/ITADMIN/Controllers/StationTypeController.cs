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
    public class StationTypeController : BaseController
    {
        //
        // GET: /ITADMIN/StationType/
        [IsSGHFeatureAuthorized(mFeatureID = "526")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]

        public ActionResult Save(StationTypeSave entry)
        {
            StationTypeModel model = new StationTypeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "StationTypeController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult FetchStationType(int Id)
        {
            StationTypeModel model = new StationTypeModel();
            List<StationTypeViewModel> list = model.StationTypeViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<StationTypeViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult StationTypeDashBoardList()
        {
            StationTypeModel model = new StationTypeModel();
            List<StationTypeDashBoard> list = model.StationTypeDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<StationTypeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
