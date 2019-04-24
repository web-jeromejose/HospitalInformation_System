using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using log4net.Core;
using log4net;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.IO;
using System.Data.SqlClient;
using System.Data;


namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CathLabEmployeeMasterController : BaseController
    {
        //
        // GET: /ITADMIN/CathLabEmployeeMaster/
        CathLabEmployeeMasterModel bs = new CathLabEmployeeMasterModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2547")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dashboard(CathLabEmployeeMasterFilter filter)
        {
            CathLabEmployeeMasterModel model = new CathLabEmployeeMasterModel();
            List<DashboardForCathLabEmployeeMaster> list = model.Dashboard(filter.TypeId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DashboardForCathLabEmployeeMaster>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddEmployee(string empid,string type)
        {
            string action = "1";
            bool status = bs.Save(empid, type, action);
            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult RemoveEmployee(string empid, string type)
        {
            string action = "3";
            bool status = bs.Save(empid, type, action);
            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
    }
}
