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
    public class SecurityController : BaseController
    {
        //
        // GET: /ITADMIN/Security/

        SghUtilitiesDB DB = new SghUtilitiesDB();


        public ActionResult Index()
        {
            return View();
        }


        /* Start
         * User Access Review Report
         * JFJ Nov 19 2016
         */
        private const string NameOfReport = "User Access Review Report";

        public ActionResult UserAccessReviewReport()
        {
            UserAccessReviewVM model = new UserAccessReviewVM();
            model.DeptList = DB.GetAllDepartment();
            return View(model);
        }

        public ActionResult ViewAllRolesReport()
        {
            UserAccessReviewVM model = new UserAccessReviewVM();
            model.DeptList = DB.GetAllDepartment();
            return View(model);
        }

        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterUserAccRpt[] filter = js.Deserialize<FilterUserAccRpt[]>(this.GetFilter());


            string DeptID = filter[0].DeptID;
            //string FromDate = filter[0].FromDate;
            //string ToDate = filter[0].ToDate;

            UserAccRpt logic = new UserAccRpt();
            return File(logic.ToPDF(DeptID), "application/pdf");
        }
        public FileResult ToPDFByAllRoles()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterUserAccRpt[] filter = js.Deserialize<FilterUserAccRpt[]>(this.GetFilter());


            string DeptID = filter[0].DeptID;
            //string FromDate = filter[0].FromDate;
            //string ToDate = filter[0].ToDate;

            UserAccRpt logic = new UserAccRpt();
            return File(logic.ToPDFByAllRoles(DeptID), "application/pdf");
        }

        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterUserAccRpt[] filter = js.Deserialize<FilterUserAccRpt[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string DeptID = filter[0].DeptID;
            //string FromDate = filter[0].FromDate;
            //string ToDate = filter[0].ToDate;

            UserAccRpt logic = new UserAccRpt();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(DeptID), "application/vnd.ms-excel", filename);
        }



    }


    public class UserAccRpt
    {
        public UserAccRpt() { }

        public DataTable GetReportHeaderDetails(string DeptID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Security_GetDept");

            return dt;
        }


        public DataTable GetReportDetails(string DeptID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID),
               // new SqlParameter("@FromDate", FromDate),
               // new SqlParameter("@ToDate", ToDate),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Security_GetDeptList");

            return dt;
        }
        public DataTable GetAllRolesDetails(string DeptID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Security_GetRoleList");

            return dt;
        }

        public byte[] ToPDF(string DeptId)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Security_UserAccessReviewRpt.rdl"; //
            rpt.AddReportParameter("DeptID", DeptId);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
            rpt.AddSource("DataSet1", this.GetReportDetails(DeptId));
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }


        public byte[] ToPDFByAllRoles(string DeptId)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Security_RoleAccessReviewRpt.rdl"; //
            rpt.AddReportParameter("DeptID", DeptId);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
            rpt.AddSource("DataSet1", this.GetAllRolesDetails(DeptId));
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }

        public byte[] ToXLS(string DeptID)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Security_UserAccessReviewRpt.rdl";
            rpt.AddReportParameter("DeptID", DeptID);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptID));
            rpt.AddSource("dsFnlAttendance", this.GetReportDetails(DeptID));
            return rpt.Generate(ReportGenerator.RptTo.ToXLS);
        }

    }
    public class FilterUserAccRpt
    {
        public string DeptID { get; set; }
 
    }

}
