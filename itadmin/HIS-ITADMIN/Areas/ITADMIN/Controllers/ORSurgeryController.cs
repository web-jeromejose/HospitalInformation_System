using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;

 
using DataLayer.ITAdmin.Model;
 
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
 
using System.Data.SqlClient;
 
using System.Security.Permissions;
 

using DataLayer.ITAdmin.Data;
using SGH;
using System.Data;
 


namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class ORSurgeryController : BaseController
    {
        //
        // GET: /ITADMIN/ORSurgery/
        HealthCheckupModel bs = new HealthCheckupModel();
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(SurgerySaveHeader entry)
        {
            ORSurgeryModel model = new ORSurgeryModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("ORSurgeryModel", "ORSurgeryController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public ActionResult ORSurgeryDashboard()
        {
            ORSurgeryModel model = new ORSurgeryModel();
            List<ORSurgeryDashBoardModel> list = model.ORSurgeryDashBoardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ORSurgeryDashBoardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult SurgeryViewDetails(int Id)
        {
            ORSurgeryModel model = new ORSurgeryModel();
            List<SurgeryViewHeader> list = model.SurgeryViewHeader(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SurgeryViewHeader>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult SelectedListItem(int Id)
        {
            ORSurgeryModel model = new ORSurgeryModel();
            List<ORSurgerySpecialisationSelected> list = model.ORSurgerySpecialisationSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ORSurgerySpecialisationSelected>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult SpecialisationListView()
        {
            ORSurgeryModel model = new ORSurgeryModel();
            List<ORSurgerySpecialisationList> list = model.ORSurgerySpecialisationList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ORSurgerySpecialisationList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bs.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        private const string NameOfReport = "Surgery List ";

        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterOrSurgeryRpt[] filter = js.Deserialize<FilterOrSurgeryRpt[]>(this.GetFilter());


           // string DeptID = filter[0].DeptID;
            //string FromDate = filter[0].FromDate;
            //string ToDate = filter[0].ToDate;

            OrSurgeryRpt logic = new OrSurgeryRpt();
            return File(logic.ToPDF(), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterOrSurgeryRpt[] filter = js.Deserialize<FilterOrSurgeryRpt[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            //string DeptID = filter[0].DeptID;
            //string FromDate = filter[0].FromDate;
            //string ToDate = filter[0].ToDate;

            OrSurgeryRpt logic = new OrSurgeryRpt();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(), "application/vnd.ms-excel", filename);
        }



    }

    public class OrSurgeryRpt
    {
        public OrSurgeryRpt() { }

      

       
         public DataTable GetAllSurgeryList()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SurgerySelected_ViewReport");

            return dt;
        }

        public byte[] ToPDF()
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Report_ORSurgery.rdl"; //
           // rpt.AddReportParameter("DeptID", DeptId);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            //rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
            rpt.AddSource("DataSet1", this.GetAllSurgeryList());
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }


        

        public byte[] ToXLS()
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Report_ORSurgery.rdl";
           // rpt.AddReportParameter("DeptID", DeptID);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("DataSet1", this.GetAllSurgeryList());
            return rpt.Generate(ReportGenerator.RptTo.ToXLS);
        }

    }
    public class FilterOrSurgeryRpt
    {
        public string DeptID { get; set; }

    }

}
