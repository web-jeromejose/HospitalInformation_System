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
    public class PHACanceDateReceiptController : BaseController
    {
        //
        // GET: /ITADMIN/PHACanceDateReceipt/
        SghUtilitiesDB model = new SghUtilitiesDB();

        [IsSGHFeatureAuthorized(mFeatureID = "2559")]
        public ActionResult Index()
        {
            return View();
        }
 
        public ActionResult PHACanceDateReceipt_Dashboard(string date)
        {

            List<PHACanceDateReceipt_Dashboard> list = model.PHACanceDateReceipt_Dashboard(date);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(list),
                ContentType = "application/json"
            };
            return result;
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(PHACanceDateReceipt_Save entry)
        {

            bool status = model.PHACanceDateReceipt_Save(entry);

            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SghUtilitiesDB", "PHACanceDateReceiptController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


    }
}
