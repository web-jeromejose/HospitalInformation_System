using DataLayer;
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
    public class FinalAttendanceRecordsController : BaseController
    {
        //
        // GET: /ITADMIN/FinalAttendanceRecords/
        private const string NameOfReport = "Final Attendance Summary";
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Select2Employeelst(string searchTerm, int pageSize, int pageNum)
        {
            Select2EmployeeV2Repository list = new Select2EmployeeV2Repository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterFinlAtten[] filter = js.Deserialize<FilterFinlAtten[]>(this.GetFilter());

 
            string EmployeeID = filter[0].EmployeeID;
            string FromDate = filter[0].FromDate;
            string ToDate = filter[0].ToDate;

            RptFnlAtten logic = new RptFnlAtten();
            return File(logic.ToPDF(EmployeeID, FromDate, ToDate), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterFinlAtten[] filter = js.Deserialize<FilterFinlAtten[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string EmployeeID = filter[0].EmployeeID;
            string FromDate = filter[0].FromDate;
            string ToDate = filter[0].ToDate;

            RptMealBillLogic logic = new RptMealBillLogic();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(EmployeeID, FromDate, ToDate), "application/vnd.ms-excel", filename);
        }


   
    }

    public class RptFnlAtten
    {
        public RptFnlAtten() { }

        public DataTable GetReportHeaderDetails(string EmployeeID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@EmployeeID", EmployeeID)
  
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OrganizationDetailsV2");

            return dt;
        }


        public DataTable GetReportDetails(string EmployeeID, string FromDate, string ToDate)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@EmployeeID", EmployeeID),
                new SqlParameter("@FromDate", FromDate),
                new SqlParameter("@ToDate", ToDate),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FinalAttenaftermgrcd_SCS");

            return dt;
        }

    


        public byte[] ToPDF(string EmployeeID, string FromDate, string ToDate)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/FinalAttendanceReport.rdl";
            rpt.AddReportParameter("EmployeeID", EmployeeID);
            rpt.AddReportParameter("FromDate", FromDate);
            rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(EmployeeID));
            rpt.AddSource("dsFnlAttendance", this.GetReportDetails(EmployeeID, FromDate, ToDate));
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }


        public byte[] ToXLS(string EmployeeID, string FromDate, string ToDate)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/FinalAttendanceReport.rdl";
            rpt.AddReportParameter("EmployeeID", EmployeeID);
            rpt.AddReportParameter("FromDate", FromDate);
            rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(EmployeeID));
            rpt.AddSource("dsFnlAttendance", this.GetReportDetails(EmployeeID, FromDate, ToDate));
            return rpt.Generate(ReportGenerator.RptTo.ToXLS);
        }



    }
    public class FilterFinlAtten
    {
        public string EmployeeID { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }


 }
