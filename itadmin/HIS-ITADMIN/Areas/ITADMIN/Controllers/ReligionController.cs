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
    public class ReligionController : BaseController
    {
        //
        // GET: /ITADMIN/Religion/
        [IsSGHFeatureAuthorized(mFeatureID = "513")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ReligionSave entry)
        {
            ReligionModel model = new ReligionModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ReligionController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult ReligionDashBoard()
        {
            ReligionModel model = new ReligionModel();
            List<ReligionDashBoard> list = model.LocationDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReligionDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchReligion(int ReligionId)
        {
            ReligionModel model = new ReligionModel();
            List<ReligionViewModel> list = model.ReligionViewModel(ReligionId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReligionViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }



    }
}
