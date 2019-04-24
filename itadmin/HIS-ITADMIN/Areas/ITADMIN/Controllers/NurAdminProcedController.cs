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

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class NurAdminProcedController : BaseController
    {
        //
        // GET: /ITADMIN/NurAdminProced/
        private const string NameOfReport = "Nursing Administration Procedure";
        NursingAdminisModel bs = new NursingAdminisModel();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bs.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult NursAdmnProcedboard()
        {
            NursingAdminisModel model = new NursingAdminisModel();
            List<NursAdmnProced> list = model.NursAdmnProced();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursAdmnProced>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchNursingAdminis(int Id)
        {
            NursingAdminisModel model = new NursingAdminisModel();
            List<NursingAdminViewModel> list = model.NursingAdminViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdminViewModel>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(NursingAdminisSaveModel entry)
        {
            NursingAdminisModel model = new NursingAdminisModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("MOHMasterSave", "NurAdminProcedController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterNursAdmn[] filter = js.Deserialize<FilterNursAdmn[]>(this.GetFilter());


            string Id = filter[0].Id;
          
            RptFnlAtten logic = new RptFnlAtten();
            return File(logic.ToPDF(Id), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterNursAdmn[] filter = js.Deserialize<FilterNursAdmn[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string Id = filter[0].Id;


            RptFnlAtten logic = new RptFnlAtten();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(Id), "application/vnd.ms-excel", filename);
        }


        public class RptFnlAtten
        {
            public RptFnlAtten() { }

            public DataTable GetReportDetails(string Id)
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[]{
                new SqlParameter("@Id", Id)
  
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.NursingAdminUtilities_REPORTS_SCS");

                return dt;
            }



            public byte[] ToPDF(string Id)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/NursingAdmnReports.rdl";
                rpt.AddReportParameter("Id", Id);
                rpt.AddSource("DataSet1", this.GetReportDetails(Id));
                return rpt.Generate(ReportGenerator.RptTo.ToPDF);
            }


            public byte[] ToXLS(string Id)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/NursingAdmnReports.rdl";
                rpt.AddReportParameter("Id", Id);
                rpt.AddSource("DataSet1", this.GetReportDetails(Id));
                return rpt.Generate(ReportGenerator.RptTo.ToXLS);
            }



        }



        public class FilterNursAdmn
        {
            public string Id { get; set; }
            
        }


    }
}
