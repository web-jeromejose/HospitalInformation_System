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
    public class BedTypeController : BaseController
    {
        //
        // GET: /ITADMIN/BedType/

        [IsSGHFeatureAuthorized(mFeatureID = "2223")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BedTypeDashBoardList()
        {
            BedTypeModel model = new BedTypeModel();
            List<BedTypeDashBoard> list = model.BedTypeDashBoardDL();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BedTypeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchBedtype(int Id)
        {
            BedTypeModel model = new BedTypeModel();
            List<BedTypeViewModel> list = model.BedTypeViewModelDL(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BedTypeViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(BedTypeSave entry)
        {
            BedTypeModel model = new BedTypeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "BedTypeController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
