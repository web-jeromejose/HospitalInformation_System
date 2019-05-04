using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using DataLayer;
using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Areas.BloodBank.Controllers;
using HIS_BloodBank.Models;
using HIS_BloodBank.Controllers;
using Microsoft.Reporting.WebForms;
using System.Data.SqlClient;
using System.Security;
using System.Security.Permissions;
using System.Data;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class IssuesIPController : BaseController
    {
        //
        // GET: /BloodBank/IssuesIP/

        public ActionResult Index()
        {
            return View();
        }

      
        public ActionResult ShowSelected(int OrderNo, int IPID)
        {
            IssuesIPModel model = new IssuesIPModel();
            List<IssueIPHeaderDetails> list = model.ShowSelected(OrderNo, IPID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IssueIPHeaderDetails>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(IPIssuedSaveHeader entry)
        {
            IssuesIPModel model = new IssuesIPModel();
            entry.operatorid = this.OperatorId;
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "IssuesIPController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        public ActionResult ShowIssueAvailCrossMatch(int OrderNo, int IPID)
        {
            IssuesIPModel model = new IssuesIPModel();
            List<IpIssueCrossmatchAvailmodel> list = model.IpIssueCrossmatchAvailmodel(OrderNo, IPID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IpIssueCrossmatchAvailmodel>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult IssueIPDashboard(int Option)
        {
            IssuesIPModel model = new IssuesIPModel();
            List<IssuesIPDashboard> list = model.IssuesIPDashboard(Option);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IssuesIPDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }




        #region Select2

        public ActionResult Select2Station(string searchTerm, int pageSize, int pageNum)
        {
            Select2WardRepository list = new Select2WardRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult SelectIssuedByRepository(string searchTerm, int pageSize, int pageNum)
        {
            SelectIssuedByRepository list = new SelectIssuedByRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion


        public FileResult Report()
        {
            #region Variables

            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;
            string xml = "";

            #endregion

            #region Get cookie.

            bool cookieExists = Request.Cookies[CONST_COOKIE_FILTER] != null;
            if (cookieExists)
            {
                xml = Request.Cookies[CONST_COOKIE_FILTER].Value;
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterIssueIPResults[] filter = js.Deserialize<FilterIssueIPResults[]>(xml);
            int OrderNo = filter[0].OrderNo;
            int IPID = filter[0].IPID;
            //int ProcedureId = filter[0].ProcedureId;
            //int RequestedId = filter[0].RequestedId;
            //DateTime FromDate = filter[0].FromDate;
            //DateTime ToDate = filter[0].ToDate;

            #endregion

            #region dtBloodBankResults


            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                //new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                new SqlParameter("@OrderNo", OrderNo),
                new SqlParameter("@IPID", IPID),
          
            };
            //db.param[0].Direction = ParameterDirection.Output;
            DataTable dtBloodBankResults = db.ExecuteSPAndReturnDataTable("BLOODBANK.BloodIssuesReports_SCS");

            #endregion


            #region Setup the report viewer object and get the array of bytes

            ReportViewer viewer = new ReportViewer();
            viewer.Reset();
            viewer.LocalReport.ReportPath = "Areas/BloodBank/Reports/BloodIssuesReports.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            viewer.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);
            // viewer.LocalReport.SetParameters(new ReportParameter("aaaDescription01", "Payslip"));

            viewer.LocalReport.DataSources.Clear();
            viewer.LocalReport.DataSources.Add(new ReportDataSource("dtBloodBankResults", dtBloodBankResults));
            //viewer.LocalReport.DataSources.Add(new ReportDataSource("FindingsDetails", FindingsDetails));
            viewer.LocalReport.Refresh();

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            #endregion

            return File(bytes, "application/pdf");
        }

        public class FilterIssueIPResults
        {
            public int OrderNo { get; set; }
            public int IPID { get; set; }    
        }

    }
}
