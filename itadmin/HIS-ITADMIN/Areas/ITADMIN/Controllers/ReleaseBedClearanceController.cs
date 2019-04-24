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
    [HandleException]
    public class ReleaseBedClearanceController : BaseController
    {
        //
        // GET: /ITADMIN/ReleaseBedClearance/
        [IsSGHFeatureAuthorized(mFeatureID = "2255")]
        public ActionResult Index()
        {
          ///  throw new Exception("test");
            return View();
        }

        public ActionResult ReleaseBedDashBoard()
        {
            ReleaseBedModel model = new ReleaseBedModel();
            List<ReleaseBedBoardModel> list = model.ReleaseBedBoardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReleaseBedBoardModel>() }),
                ContentType = "application/json"
            };
            return result;
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ReleaseBedHeaderSave entry)
        {
            ReleaseBedModel model = new ReleaseBedModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("ReleaseBedModel", "ReleaseBedClearanceController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        //for vacant
        public ActionResult ForVacant()
        {
            ///  throw new Exception("test");
            return View();
        }

        public ActionResult ForVacantReleaseBedDashBoard()
        {
            ReleaseBedModel model = new ReleaseBedModel();
            List<ReleaseBedBoardModel> list = model.ForVacantReleaseBedBoardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReleaseBedBoardModel>() }),
                ContentType = "application/json"
            };
            return result;
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ForVacantSave(ReleaseBedHeaderSave entry)
        {
            ReleaseBedModel model = new ReleaseBedModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.ForVacantSave(entry);
         
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ReleaseBedClearanceController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());




            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

          

        }








    }
}
