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
    public class RoomController : BaseController
    {
        //
        // GET: /ITADMIN/Room/
        [IsSGHFeatureAuthorized(mFeatureID = "2225")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(RoomsSave entry)
        {
            RoomModel model = new RoomModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OPTariffController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult CityDashBoard()
        {
            RoomModel model = new RoomModel();
            List<RoomsDashBoard> list = model.RoomsDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RoomsDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchCity(int Id)
        {
            RoomModel model = new RoomModel();
            List<RoomsViewModel> list = model.RoomsViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RoomsViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
