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
using Microsoft.Reporting.WebForms;
using System.Security;
using System.Security.Permissions;

namespace HIS.Controllers
{
    [Authorize]
    public class BaseController : Controller
    {
        public const string CONST_COOKIE_FILTER = "Filterfy";
        private int? _operatorId;
        private int _departmentId;
        private string _operatorName;
        private int _divisionId;
        private string _version;
        ConstantModel cons = new ConstantModel();
        ApplicationVersionModel apps = new ApplicationVersionModel();
      

        public BaseController()
        {
        }

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
                if (Request.Cookies["HIS_STATION"] != null)                
                    return Convert.ToInt32(Request.Cookies["HIS_STATION"].Value);
                else
                    return 0;
            }
            set 
            {
                Response.Cookies.Add(new HttpCookie("HIS_STATION", value.ToString()));

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
        public void GetApplicationMenu()
        {
            if (Request.Cookies["MenuModel"] == null)
            {
                ApplicationGlobal app = new ApplicationGlobal();
                ApplicationVersionModel model = app.GetApplicationDetail();
                ControllerContext.StoreModelToCookies("MenuModel", model);
            }
            else
            {
                var d = JsonConvert.DeserializeObject<ApplicationVersionModel>(Request.Cookies["AppModel"].Value);
                _version =  d.MajorVersion + "." + d.MinorVersion;
            }
        }

        public bool GetIssueAuthorityCode(string branchCode)
        {
     
            string IssueAuthorityCode = "";
            ApplicationGlobal app = new ApplicationGlobal();
            ApplicationVersionModel model = app.GetApplicationDetail();
            IssueAuthorityCode = model.IssueAuthorityCode;

            if (branchCode == IssueAuthorityCode)
                return true;
            else
                return false;
        }


        [HttpGet]
        public void GetApplicationDetails()
        {
           
        }

        public class CustomMessage
        {
            public string Title { get; set; }
            public string Message { get; set; }
            public int ErrorCode { get; set; }
        }

        [HttpGet]
        public JsonResult SecurityFeature()
        {
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            HISSecurity cs = new HISSecurity();
            cs.UserID = d[0].ToString();
            cs.ModuleID = cons.cModuleID;
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
            cs.ModuleID = cons.cModuleID;
            cs.FeatureID = this.FeatureID ;
            
            var li = cs.SecuritryFunctionCS();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Request.Cookies["AppModel" + cons.cModuleID] != null)
            {
                apps = JsonConvert.DeserializeObject<ApplicationVersionModel>(Request.Cookies["AppModel" + cons.cModuleID].Value);

                string connString = ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString + ";Application Name=WebUtilities";
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connString);                
                string IPAddress = builder.DataSource;
                ViewBag.VersionID = apps.MajorVersion + "." + apps.MinorVersion;
                ViewBag.Title = apps.ModuleName;
                ViewBag.BranchCode = apps.ModuleName;
                ViewBag.DateDeployed = apps.DateDeployed;
                ViewBag.BranchName = apps.Name;
                ViewBag.Address = apps.Address;
                ViewBag.PhoneNo = apps.PhoneNo;
                ViewBag.FaxNo = apps.FaxNo;
                ViewBag.IssueAuthorityCode = apps.IssueAuthorityCode;
                ViewBag.Developer = apps.Developer;
                //ViewBag.ConServer = connString;
                ViewBag.ConServer = "HIS";
                ViewBag.LocalIPAddress = LocalIPAddress();
                ViewBag.CopyRight = apps.CopyRight;                
            }

            base.OnActionExecuting(filterContext);
            _setLogInfo();
        }
        public string LocalIPAddress()
        {
            string stringIpAddress;
            stringIpAddress = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (stringIpAddress == null) //may be the HTTP_X_FORWARDED_FOR is null
                stringIpAddress = Request.ServerVariables["REMOTE_ADDR"]; //we can use REMOTE_ADDR
            else if (stringIpAddress == null)
                stringIpAddress = GetLanIPAddress();

            return stringIpAddress;
        }
        public string GetLanIPAddress()
        {
            //Get the Host Name
            string stringHostName = Dns.GetHostName();
            //Get The Ip Host Entry
            IPHostEntry ipHostEntries = Dns.GetHostEntry(stringHostName);
            //Get The Ip Address From The Ip Host Entry Address List
            System.Net.IPAddress[] arrIpAddress = ipHostEntries.AddressList;
            return arrIpAddress[arrIpAddress.Length - 1].ToString();
        }

        public class ReportParam
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }
        public class ReportDataSourceParam
        {
            public string Name { get; set; }
            public DataTable DataSourceValue { get; set; }
        }

        public string GetFilter()
        {
            string json = "";
            bool cookieExists = Request.Cookies[CONST_COOKIE_FILTER] != null;
            if (cookieExists) json = Request.Cookies[CONST_COOKIE_FILTER].Value;
            return json;
        }


        public void _setLogInfo()
        {

            Response.Cookies.Add(new HttpCookie("ELOG_PAR1", OperatorId.ToString()));
            Response.Cookies.Add(new HttpCookie("ELOG_PAR2", LocalIPAddress().ToString()));
            Response.Cookies.Add(new HttpCookie("ELOG_PAR3",StationId.ToString()));
        }



    }

    public class ReportParam
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
    public class ReportDataSourceParam
    {
        public string Name { get; set; }
        public DataTable DataSourceValue { get; set; }
    }

    public class ReportGenerator
    {
        public enum RptTo : int { ToPDF = 0, ToXLS }
        private List<ReportParam> _reportParameters = new List<ReportParam>();
        private List<ReportDataSourceParam> _reportDataSourceParameters = new List<ReportDataSourceParam>();
        private string _sp = "";
        private string _path = "";


        public void AddSource(string pName, DataTable pDataSource)
        {
            _reportDataSourceParameters.Add(new ReportDataSourceParam
            {
                Name = pName,
                DataSourceValue = pDataSource
            });
        }
        public void AddReportParameter(string pName, string pValue)
        {
            _reportParameters.Add(new ReportParam
            {
                Name = pName,
                Value = pValue
            });
        }
        public string Path
        {
            get { return _path; }
            set { _path = value; }
        }


        public byte[] Generate(RptTo doc = RptTo.ToPDF)
        {
            #region Variables

            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            #endregion


            #region Setup the report viewer object and get the array of bytes

            ReportViewer viewer = new ReportViewer();
            viewer.Reset();
            viewer.LocalReport.ReportPath = this.Path;

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            viewer.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);
            foreach (ReportParam parameter in _reportParameters) viewer.LocalReport.SetParameters(new ReportParameter(parameter.Name, parameter.Value));

            viewer.LocalReport.DataSources.Clear();
            foreach (ReportDataSourceParam source in _reportDataSourceParameters) viewer.LocalReport.DataSources.Add(new ReportDataSource(source.Name, source.DataSourceValue));
            viewer.LocalReport.Refresh();

            string strDoc = "";
            if (doc == RptTo.ToPDF) strDoc = "PDF";
            else if (doc == RptTo.ToXLS) strDoc = "Excel";
            byte[] bytes = viewer.LocalReport.Render(strDoc, null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            #endregion

            return bytes;
        }

    }
}
