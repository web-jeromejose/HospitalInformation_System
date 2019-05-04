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
using System.Data;
using System.Security;
using System.Security.Permissions;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class CrossmatchIPController : BaseController
    {
        //
        // GET: /BloodBank/CrossmatchIP/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList()
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            List<MainListCrossmatchIP> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListCrossmatchIP>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult ShowSelected(int Id)
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            List<MainListCrossmatchIP> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListCrossmatchIP>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult ShowIssueQuantity(int OrderNo, int ComponentId, int BGroup)
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            List<IssueingQuantity> list = model.IssueingQuantity(OrderNo, ComponentId, BGroup);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IssueingQuantity>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult ShowCrossReservedExtend(int Id)
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            List<ReservedExtendModel> list = model.ReservedExtendModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReservedExtendModel>() }),
                ContentType = "application/json"
            };
            return result;
        }



        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveMaxLab(SaveMaxLabNo entry)
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            entry.OperatorID = this.OperatorId;
            //if (entry.Action != 1) entry.modifiedby = this.OperatorId;
            bool status = model.SaveMaxLab(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveMaxLab", "BB--" + "CrossmatchIPController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CrossMatchSaveHeader entry)
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "CrossmatchIPController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveExtendUnReserve(ReservedExtendSaveHeader entry)
        {
            CrossmatchIPModel model = new CrossmatchIPModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.SaveUnReserved(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveExtendUnReserve", "BB--" + "CrossmatchIPController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #region Select2

        public ActionResult Select2CrossmatchIPBloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2CrossmatchIPBloodGroupRepository list = new Select2CrossmatchIPBloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2CrossmatchBy(string searchTerm, int pageSize, int pageNum)
        {
            Select2CrossmatchByRepository list = new Select2CrossmatchByRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2BGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2BGroupRepository list = new Select2BGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public ActionResult Select2CrossMatchType(string searchTerm, int pageSize, int pageNum)
        {
            Select2CrossMatchTypeRepository list = new Select2CrossMatchTypeRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public ActionResult Select2Compatablitiy(string searchTerm, int pageSize, int pageNum)
        {
            Select2CompatablityRepository list = new Select2CompatablityRepository();
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
            FilterCrossMatchedReserved[] filter = js.Deserialize<FilterCrossMatchedReserved[]>(xml);
            int OrderNo = filter[0].OrderNo;
            int IPID = filter[0].IPID;
            //int ProcedureId = filter[0].ProcedureId;
            //int RequestedId = filter[0].RequestedId;
            //DateTime FromDate = filter[0].FromDate;
            //DateTime ToDate = filter[0].ToDate;

            #endregion

            #region dtCrossMatchReserved


            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                //new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                new SqlParameter("@OrderNo", OrderNo),
                new SqlParameter("@IPID", IPID),
          
            };
            //db.param[0].Direction = ParameterDirection.Output;
            DataTable dtCrossMatchReserved = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossMatchReservedReports_SCS");

            #endregion


            #region Setup the report viewer object and get the array of bytes

            ReportViewer viewer = new ReportViewer();
            viewer.Reset();
            viewer.LocalReport.ReportPath = "Areas/BloodBank/Reports/CrossmatchIPReserved.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            viewer.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);
            // viewer.LocalReport.SetParameters(new ReportParameter("aaaDescription01", "Payslip"));

            viewer.LocalReport.DataSources.Clear();
            viewer.LocalReport.DataSources.Add(new ReportDataSource("dtCrossMatchReserved", dtCrossMatchReserved));
            //viewer.LocalReport.DataSources.Add(new ReportDataSource("FindingsDetails", FindingsDetails));
            viewer.LocalReport.Refresh();

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            #endregion

            return File(bytes, "application/pdf");
        }

      

        public FileResult Report1()
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
            FilterCrossMatchedReserved[] filter = js.Deserialize<FilterCrossMatchedReserved[]>(xml);
            int OrderNo = filter[0].OrderNo;
            int IPID = filter[0].IPID;
            //int ProcedureId = filter[0].ProcedureId;
            //int RequestedId = filter[0].RequestedId;
            //DateTime FromDate = filter[0].FromDate;
            //DateTime ToDate = filter[0].ToDate;

            #endregion

            #region dtCrossMatchReserved2


            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                //new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                new SqlParameter("@OrderNo", OrderNo),
                new SqlParameter("@IPID", IPID),
          
            };
            //db.param[0].Direction = ParameterDirection.Output;
            DataTable dtCrossMatchReserved2 = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossMatchReservedReports2_SCS");

            #endregion


            #region Setup the report viewer object and get the array of bytes

            ReportViewer viewer = new ReportViewer();
            viewer.Reset();
            viewer.LocalReport.ReportPath = "Areas/BloodBank/Reports/CrossmatchIPReserved2.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            viewer.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);
            // viewer.LocalReport.SetParameters(new ReportParameter("aaaDescription01", "Payslip"));

            viewer.LocalReport.DataSources.Clear();
            viewer.LocalReport.DataSources.Add(new ReportDataSource("dtCrossMatchReserved2", dtCrossMatchReserved2));
            //viewer.LocalReport.DataSources.Add(new ReportDataSource("FindingsDetails", FindingsDetails));
            viewer.LocalReport.Refresh();

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            #endregion

            return File(bytes, "application/pdf");
        }

        public class FilterCrossMatchedReserved
        {
            public int OrderNo { get; set; }
            public int IPID { get; set; }
        }


    }


}
