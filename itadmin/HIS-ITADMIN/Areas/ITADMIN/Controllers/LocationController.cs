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

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class LocationController : BaseController
    {
        //
        // GET: /ITADMIN/Location/

        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(LocationSave entry)
        {
            LocationModel model = new LocationModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult LocationDashBoard()
        {
            LocationModel model = new LocationModel();
            List<LocationDashBoard> list = model.LocationDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<LocationDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchLocation(int LocationId)
        {
            LocationModel model = new LocationModel();
            List<LocationViewModel> list = model.LocationViewModel(LocationId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<LocationViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

     

    }
}
