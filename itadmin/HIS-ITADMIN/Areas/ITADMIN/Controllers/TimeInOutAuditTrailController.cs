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
    public class TimeInOutAuditTrailController : BaseController
    {
        //
        // GET: /ITADMIN/TimeInOutAuditTrail/
        private const string NameOfReport = "Attendance Summary";
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Select2Department(string searchTerm, int pageSize, int pageNum)
        {
            Select2DepartmentRepository list = new Select2DepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2Employeelst(string searchTerm, int pageSize, int pageNum)
        {
            Select2EmployeeRepository list = new Select2EmployeeRepository();
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
            FilterMealBills[] filter = js.Deserialize<FilterMealBills[]>(this.GetFilter());

            string FromDateLog = filter[0].FromDateLog;
            string ToDateLog = filter[0].ToDateLog;
            string EmpId = filter[0].EmpId;

            RptMealBillLogic logic = new RptMealBillLogic();
            return File(logic.ToPDF(FromDateLog, ToDateLog, EmpId), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterMealBills[] filter = js.Deserialize<FilterMealBills[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string FromDateLog = filter[0].FromDateLog;
            string ToDateLog = filter[0].ToDateLog;
            string EmpId = filter[0].EmpId;

            RptMealBillLogic logic = new RptMealBillLogic();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(FromDateLog, ToDateLog, EmpId), "application/vnd.ms-excel", filename);
        }


   
    }
    public class RptMealBillLogic
    {
        public RptMealBillLogic() { }
        public DataTable GetReportDetails(string FromDateLog, string ToDateLog, string EmpId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@FromDateLog", FromDateLog),
                new SqlParameter("@ToDateLog", ToDateLog),
                new SqlParameter("@EmpId", EmpId),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.DailyTimeRecordsInDetails");

            return dt;
        }

        public byte[] ToPDF(string FromDateLog, string ToDateLog, string EmpId)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/ITADMINDailyTimeRecordsInDetailsFixed.rdl";
            rpt.AddReportParameter("FromDateLog", FromDateLog);
            rpt.AddReportParameter("ToDateLog", ToDateLog);
            rpt.AddReportParameter("EmpId", EmpId);
            rpt.AddSource("DataSet1", this.GetReportDetails(FromDateLog, ToDateLog, EmpId));
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }
        public byte[] ToXLS(string FromDateLog, string ToDateLog, string EmpId)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/ITADMINDailyTimeRecordsInDetailsFixed.rdl";
            rpt.AddReportParameter("FromDateLog", FromDateLog);
            rpt.AddReportParameter("ToDateLog", ToDateLog);
            rpt.AddReportParameter("EmpId", EmpId);
            rpt.AddSource("DataSet1", this.GetReportDetails(FromDateLog, ToDateLog, EmpId));
            return rpt.Generate(ReportGenerator.RptTo.ToXLS);
        }
    }
    public class FilterMealBills
    {
        public string FromDateLog { get; set; }
        public string ToDateLog { get; set; }
        public string EmpId { get; set; }
    }
}
