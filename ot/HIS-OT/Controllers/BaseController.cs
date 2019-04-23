using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Web.Security;
using System.Web.Script.Serialization;
using System.Globalization;
using DataLayer;
using Newtonsoft.Json;
using System.Xml.Linq;
using System.Configuration;
using System.Net;
using System.Net.Sockets;
using System.Data.SqlClient;

using HIS_OT.Areas.OT.Models;
using System.Text.RegularExpressions;

namespace HIS_OT.Controllers
{


    public static class MyExtensions
    {
        //From http://stackoverflow.com/questions/5663655/like-operator-in-linq-to-objects
        //For sql "Like" comparison in linq to objects
        public static bool Like(this string s, string pattern)
        {
            //Find the pattern anywhere in the string
            pattern = ".*" + pattern + ".*";

            return Regex.IsMatch(s, pattern, RegexOptions.IgnoreCase);
        }
    }

    [Authorize]
    public class BaseController1 : Controller
    {
        public const string CONST_COOKIE_FILTER = "Filterfy";
        private int? _operatorId;
        private int? _stationId;
        private int _departmentId;
        private string _operatorName;
        private int _divisionId;
        private string _issueAuthorityCode;


        public BaseController1()
        {
        }

        public string IssueAuthorityCode { get { return _issueAuthorityCode; } }

        public int OperatorId
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return Convert.ToInt32(d[0].ToString());
            }

            set { _operatorId = value; }
        }

        public int StationId
        {
            get
            {
                //return Convert.ToInt32(Session["stationId"]);
                if (Request.Cookies["HIS_STATION"] != null)
                    //if (HttpContext.cr.Current.Response.Cookies["HIS_STATION"] != null)
                    return Convert.ToInt32(Request.Cookies["HIS_STATION"].Value);
                else
                    return 0;
            }
            set
            {
                //HttpCookie cookie = new HttpCookie("HIS_STATION");
                //cookie.Expires = DateTime.Now.AddDays(-1d);
                //cookie.Value = value.ToString();

                Response.Cookies.Add(new HttpCookie("HIS_STATION", value.ToString()));

                //Session["stationId"] = value; 
            }

        }

        public int DepartmentId
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return Convert.ToInt32(d[4].ToString());
            }

            set { _departmentId = value; }
        }

        public int DivisionId
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return Convert.ToInt32(d[3].ToString());
            }

            set { _divisionId = value; }
        }

        public string OperatorName
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return d[2].ToString();
            }

            set { _operatorName = value; }
        }

        public string FeatureID
        {
            get
            {
                if (Request.Cookies["HIS_FUNC"] != null)
                    return Request.Cookies["HIS_FUNC"].Value;
                else
                    return "0";
            }
            set
            {
                Response.Cookies.Add(new HttpCookie("HIS_FUNC", value.ToString()));
            }
        }


        [HttpGet]
        public JsonResult SecurityFeature()
        {
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            HISSecurity cs = new HISSecurity();
            cs.UserID = d[0].ToString();
            cs.ModuleID = "5";
            var li = cs.SecuritryFeatureCS();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult SecurityFunction()
        {
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            HISSecurity cs = new HISSecurity();
            cs.UserID = d[0].ToString();
            cs.ModuleID = "5";
            cs.FeatureID = this.FeatureID;
            var li = cs.SecuritryFunctionCS();
            return Json(li, JsonRequestBehavior.AllowGet);
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


    }


    public class CurrentStation
    {
        public string label { get; set; }
        public string value { get; set; }
        public List<LabelValue> ListOStations { get; set; }
    }
    public class LabelValue
    {
        public string label { get; set; }
        public string value { get; set; }
    }
    //public class CustomMessage
    //{
    //    public string Title { get; set; }
    //    public string Message { get; set; }
    //    public int ErrorCode { get; set; }
    //}
     
}
