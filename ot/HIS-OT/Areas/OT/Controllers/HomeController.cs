using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
using System.Web.Security;
using HIS.Controllers;

namespace HIS_OT.Areas.OT.Controllers
{
   // [Authorize] test
    public class HomeController : BaseController
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            ConstantModel cons = new ConstantModel();
            glob.UserID = this.OperatorId.ToString();
            glob.ModuleID = "5";
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();

            ////log  
            //var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            //string log_details = log_serializer.Serialize(menu);
            //MasterLogs log = new MasterLogs();
            //bool logs = log.loginsert("ShowMenu", "OT--" + "HomeController", "0", "0", this.OperatorId, log_details);



            if (menu.Count == 0)
                return PartialView("_UnAuthorized", menu ?? new List<ApplicationMenuModel>());
            else
               return View("", menu ?? new List<ApplicationMenuModel>());
           

        }



        public ActionResult GetListOfStation(int ModuleId)
        {
            List<CurrentStation> list = this.GetCurrentStation(5);
            if (list[0].value.Length > 0) this.StationId = int.Parse(list[0].value);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CurrentStation>() }),
                ContentType = "application/json"
            };
            return result;
        }


        private List<CurrentStation> GetCurrentStation(int ModuleId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ModuleId", ModuleId),
                new SqlParameter("@EmpId", this.OperatorId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetCurrentStation");
            List<CurrentStation> list = new List<CurrentStation>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<CurrentStation>();
            }
            else
            {
                CurrentStation empty = new CurrentStation();
                empty.label = "";
                empty.value = "";
                list.Add(empty);
            }
            list[0].ListOStations = this.GetStation(5);

            return list;
        }

        private List<LabelValue> GetStation(int ModuleId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ModuleId", ModuleId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetStation");
            List<LabelValue> list = new List<LabelValue>();
            if (dt.Rows.Count > 0) list = dt.ToList<LabelValue>();

            return list;
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SetCurrentStation(int Value)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@ModuleId", 5), 
                    new SqlParameter("@EmpId", this.OperatorId),
                    new SqlParameter("@Value", Value)
                };
            db.param[0].Direction = ParameterDirection.Output;
            db.ExecuteSP("OT.SetCurrentStation");
            string ErrorMessage = db.param[0].Value.ToString();

            bool status = ErrorMessage.Split('-')[0] == "100";

            if (status) this.StationId = Value; // Set to current station

            return Json(new CustomMessage { Title = "Message...", Message = ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }


    }
}
