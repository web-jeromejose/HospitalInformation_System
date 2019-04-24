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
    public class StraightDutyReportsController : BaseController
    {
        //
        // GET: /ITADMIN/StraightDutyReports/
        private const string NameOfReport = "Straight Duty";
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



        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            StraightDuty[] filter = js.Deserialize<StraightDuty[]>(this.GetFilter());


            string DeptID = filter[0].DeptID;

            RptMealBillLogic logic = new RptMealBillLogic();
            return File(logic.ToPDF( DeptID), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            StraightDuty[] filter = js.Deserialize<StraightDuty[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string DeptID = filter[0].DeptID;

            RptMealBillLogic logic = new RptMealBillLogic();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(DeptID), "application/vnd.ms-excel", filename);
        }

        public class RptMealBillLogic
        {
            public RptMealBillLogic() { }
            public DataTable GetReportDetails(string DeptID)
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID)
      
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SP_GET_StraightDutyEmployee");

                return dt;
            }

            public byte[] ToPDF(string DeptID)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/ITADMINStraightDutyReports.rdl";
                rpt.AddReportParameter("DeptID", DeptID);
                rpt.AddSource("DataSet1", this.GetReportDetails(DeptID));
                return rpt.Generate(ReportGenerator.RptTo.ToPDF);
            }
            public byte[] ToXLS(string DeptID)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/ITADMINStraightDutyReports.rdl";
                rpt.AddReportParameter("DeptID", DeptID);
                rpt.AddSource("DataSet1", this.GetReportDetails(DeptID));
                return rpt.Generate(ReportGenerator.RptTo.ToXLS);
            }
        }
        public class StraightDuty
        {
            public string DeptID { get; set; }
        }
    }
}
