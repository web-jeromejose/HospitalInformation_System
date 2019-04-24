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

using DataLayer.ITAdmin.Data;
using SGH;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    [HandleException]
    public class RamadanCutOffController : BaseController
    {
        //
        // GET: /ITADMIN/RamadanCutOff/
        [IsSGHFeatureAuthorized(mFeatureID = "2557")]
        public ActionResult Index()
        {
            return View();
        }

        

            [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult RamadanCutOffSave(RamadanCutoff entry)
        {
            SghUtilitiesDB model = new SghUtilitiesDB();
          
            bool status = model.RamadanCutOffSave(entry);
       
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RamadanCutOffSave", "RamadanCutOffController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
