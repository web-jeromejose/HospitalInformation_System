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
    public class OccupationController : BaseController
    {
        //
        // GET: /ITADMIN/Occupation/
        [IsSGHFeatureAuthorized(mFeatureID = "515")]
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OccupationSave entry)
        {
            OccupationModel model = new OccupationModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OccupationController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult FetchOccupation(int Id)
        {
            OccupationModel model = new OccupationModel();
            List<OccupationViewModel> list = model.OccupationViewModelDal(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OccupationViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult OccupationDashBoard()
        {
            OccupationModel model = new OccupationModel();
            List<OccupationDashBoard> list = model.OccupationDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OccupationDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }




    }
}
