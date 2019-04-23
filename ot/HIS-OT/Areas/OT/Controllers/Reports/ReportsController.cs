using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
using Microsoft.Reporting.WebForms;
using System.Security.Permissions;
using System.Security;
using HIS.Controllers;


namespace HIS_OT.Areas.OT.Controllers
{
    public class ReportsController : BaseController
    {
        #region Views

        public ActionResult SurgeryRecordDateWise()
        {
            return View();
        }
        public ActionResult SurgeriesDepartmentWise()
        {
            return View();
        }
        public ActionResult OTWiseSchedule()
        {
            return View();
        }
        public ActionResult OTRequest()
        {
            return View();
        }
        public ActionResult OTSchedules()
        {
            return View();
        }
        public ActionResult SurgeonWiseSchedule()
        {
            return View();
        }
        public ActionResult ProcedureManual()
        {
            return View();
        }
        public ActionResult DailyORDonelistReports()
        {
            return View();
        }
        public ActionResult OtReportMRD()
        {
            return View();
        }
        public ActionResult SchedConfirmedBooking()
        {
            return View();
        }
        public ActionResult SchedCancelledBooking()
        {
            return View();
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
            FilterDailyORListDoneModel[] filter = js.Deserialize<FilterDailyORListDoneModel[]>(xml);

            DateTime FromDate = filter[0].FromDate;
            DateTime ToDate = filter[0].ToDate;
          
            #endregion

            #region dsDailyOrListingReports


            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                //new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                new SqlParameter("@FromDate", FromDate),
                new SqlParameter("@ToDate", ToDate)

            };
            //db.param[0].Direction = ParameterDirection.Output;
            DataTable dsDailyOrListingReports = db.ExecuteSPAndReturnDataTable("OT.ReportDailyORListingReports_SCS");

            #endregion



            //#region FindingsDetails


            ////DBHelper db = new DBHelper();
            //db.param = new SqlParameter[]{
            //    //new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
            //    new SqlParameter("@FromDate", FromDate),
            //    new SqlParameter("@ToDate", ToDate),
            //    new SqlParameter("@DepartmentId", DepartmentId),
            //    new SqlParameter("@DoctorId", DoctorId),
            //};
            ////db.param[0].Direction = ParameterDirection.Output;
            //DataTable FindingsDetails = db.ExecuteSPAndReturnDataTable("ENDO.GetFindingsReports_Details");

            //#endregion



            #region Setup the report viewer object and get the array of bytes

            ReportViewer viewer = new ReportViewer();
            viewer.Reset();
            viewer.LocalReport.ReportPath = "Areas/OT/Reports/ORDoneListReports.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            viewer.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);
            // viewer.LocalReport.SetParameters(new ReportParameter("aaaDescription01", "Payslip"));

            viewer.LocalReport.DataSources.Clear();
            viewer.LocalReport.DataSources.Add(new ReportDataSource("dsDailyOrListingReports", dsDailyOrListingReports));
            //viewer.LocalReport.DataSources.Add(new ReportDataSource("FindingsDetails", FindingsDetails));
            viewer.LocalReport.Refresh();

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            #endregion

            return File(bytes, "application/pdf");
        }

        public ActionResult MainListSurgeryRecordDateWise(DateTime from,DateTime to, int flag)
        {
            List<MainListSurgeryRecordDateWise> list;
            if (flag==1) {
                list = this.GetMainListSurgeryRecordDateWiseWithOR(from, to);
            }
            else {
                list = this.GetMainListSurgeryRecordDateWiseWithOutOR(from, to);
            }

            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListSurgeryRecordDateWise>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult MainListSurgeriesDepartmentWise(int deptid, DateTime date, int MonthOrDate)
        {
            List<MainListSurgeriesDepartmentWise> list = this.GetMainListSurgeriesDepartmentWise(deptid, date, MonthOrDate);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListSurgeriesDepartmentWise>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult MainListOTWiseSchedule(int otid, DateTime dfrom, DateTime dto)
        {
            List<MainListOTWiseSchedule> list = this.GetMainListOTWiseSchedule(otid, dfrom, dto);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOTWiseSchedule>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult MainListOTRequest(DateTime dfrom, DateTime dto)
        {
            List<MainListOTRequest> list = this.GetMainListOTRequest(dfrom, dto);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOTRequest>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult MainListOTSchedule(DateTime dfrom, DateTime dto)
        {
            List<MainListOTSchedulev2> list = this.GetMainListOTSchedule(dfrom, dto);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOTSchedulev2>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult MainListSurgeonWiseSchedule(int surgeonId, DateTime dfrom, DateTime dto)
        {
            List<MainListSurgeonWiseSchedule> list = this.GetMainListSurgeonWiseSchedule(surgeonId, dfrom, dto);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListSurgeonWiseSchedule>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult MainListOTScheduleConfirmedReport(DateTime dfrom, DateTime dto)
        {
            List<MainListOTSchedule> list = this.GetMainListOTScheduleConfirmed(dfrom, dto);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOTSchedule>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult MainListOTScheduleCancelledReport(DateTime dfrom, DateTime dto)
        {
            List<MainListOTSchedule> list = this.GetMainListOTScheduleCancelled(dfrom, dto);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOTSchedule>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult OperationReport()
        {
            return View();
        }


        #region select2

        public ActionResult Select2OTReportDepartment(string searchTerm, int pageSize, int pageNum)
        {
            Select2OTReportDepartmentRepository list = new Select2OTReportDepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2ReportOperationTheatre(string searchTerm, int pageSize, int pageNum)
        {
            Select2ReportOperationTheatreRepository list = new Select2ReportOperationTheatreRepository();
            list.Fetch(this.StationId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2ReportSurgeon(string searchTerm, int pageSize, int pageNum)
        {
            Select2ReportSurgeonRepository list = new Select2ReportSurgeonRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

        #region private list

        private List<MainListSurgeryRecordDateWise> GetMainListSurgeryRecordDateWiseWithOR(DateTime from, DateTime to)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@StartDate", from),
                new SqlParameter("@EndDate", to)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportSurgeryRecordDateWiseWithOR");
            List<MainListSurgeryRecordDateWise> list = dt.ToList<MainListSurgeryRecordDateWise>();
            if (list == null) list = new List<MainListSurgeryRecordDateWise>();

            return list;
        }
        private List<MainListSurgeryRecordDateWise> GetMainListSurgeryRecordDateWiseWithOutOR(DateTime from, DateTime to)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@StartDate", from),
                new SqlParameter("@EndDate", to)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportSurgeryRecordDateWiseWithOutOR");
            List<MainListSurgeryRecordDateWise> list = dt.ToList<MainListSurgeryRecordDateWise>();
            if (list == null) list = new List<MainListSurgeryRecordDateWise>();

            return list;
        }
        private List<MainListSurgeriesDepartmentWise> GetMainListSurgeriesDepartmentWise(int deptid, DateTime date, int MonthOrDate)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@deptid", deptid),
                new SqlParameter("@date", date),
                new SqlParameter("@MonthOrDate", MonthOrDate)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportSurgeriesDepartmentWise");
            List<MainListSurgeriesDepartmentWise> list = dt.ToList<MainListSurgeriesDepartmentWise>();
            if (list == null) list = new List<MainListSurgeriesDepartmentWise>();

            return list;
        }
        private List<MainListOTWiseSchedule> GetMainListOTWiseSchedule(int otid, DateTime dfrom, DateTime dto)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@otid", otid),
                new SqlParameter("@dfrom", dfrom),
                new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportOTWiseSchedule");
            List<MainListOTWiseSchedule> list = dt.ToList<MainListOTWiseSchedule>();
            if (list == null) list = new List<MainListOTWiseSchedule>();

            return list;
        }
        private List<MainListOTRequest> GetMainListOTRequest(DateTime dfrom, DateTime dto)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@dfrom", dfrom),
                new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportOTRequest");
            List<MainListOTRequest> list = dt.ToList<MainListOTRequest>();
            if (list == null) list = new List<MainListOTRequest>();

            return list;
        }

        private List<MainListOTSchedulev2> GetMainListOTSchedule(DateTime dfrom, DateTime dto)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@dfrom", dfrom),
                new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportOTSchedule");
            List<MainListOTSchedulev2> list = dt.ToList<MainListOTSchedulev2>();
            if (list == null) list = new List<MainListOTSchedulev2>();

            return list;
        }
        private List<MainListSurgeonWiseSchedule> GetMainListSurgeonWiseSchedule(int surgeonId, DateTime dfrom, DateTime dto)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeonId", surgeonId),
                new SqlParameter("@dfrom", dfrom),
                new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ReportOTSurgeonWiseSchedule");
            List<MainListSurgeonWiseSchedule> list = dt.ToList<MainListSurgeonWiseSchedule>();
            if (list == null) list = new List<MainListSurgeonWiseSchedule>();

            return list;
        }

        private List<MainListOTSchedule> GetMainListOTScheduleConfirmed(DateTime dfrom, DateTime dto)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@dfrom", dfrom),
                new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.NewSched_confirmed");//[OT].[NewSched_confirmed]
            List<MainListOTSchedule> list = dt.ToList<MainListOTSchedule>();
            if (list == null) list = new List<MainListOTSchedule>();

            return list;
        }

        private List<MainListOTSchedule> GetMainListOTScheduleCancelled(DateTime dfrom, DateTime dto)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@dfrom", dfrom),
                new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.NewSched_cancelled");// [OT].[NewSched_cancelled]
            List<MainListOTSchedule> list = dt.ToList<MainListOTSchedule>();
            if (list == null) list = new List<MainListOTSchedule>();

            return list;
        }

        #endregion

    }





    #region Entity

    public class MainListSurgeryRecordDateWise
    {
        public decimal SqNo { get; set; }
        public int Id { get; set; }
        public int IpIdOpId { get; set; }
        public string PatientName { get; set; }
        public string BedName { get; set; }
        public int RegNo { get; set; }
        public string IssueAuth { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string OTNo { get; set; }
        public string OtStartDateTime { get; set; }
        public string OtEndDateTime { get; set; }
        public string Operation { get; set; }
        public string SurgeonName { get; set; }
        public string Anaesthetist { get; set; }
        public string Anaesthesia { get; set; }
        public string MRDStatus { get; set; }
        public string StationName { get; set; }
        public int BedId { get; set; }

        public string OtStartDateTimeT { get; set; }
        public string OtEndDateTimeT { get; set; }
    }
    public class MainListSurgeriesDepartmentWise
    {
        public int typeid { get; set; }
        public int ctr { get; set; }
        public string surgeon { get; set; }
        public int surgeryid { get; set; }
        public string Surgery { get; set; }
        public int coun1 { get; set; }
    }
    public class MainListOTWiseSchedule
    {
        public int ctr { get; set; }
        public int ID { get; set; }
        public string fromdatetime { get; set; }
        public string todatetime { get; set; }
        public string Name { get; set; }
        public string Age { get; set; }
        public string BedNo { get; set; }
        public string Ward { get; set; }
        public string Surgery { get; set; }
        public string Surgeon { get; set; }
        public string Anaesthetist { get; set; }
        public string Anaesthesia { get; set; }
    }
    public class MainListOTRequest
    {
        public int ID { get; set; }
        public int ctr { get; set; }
        public string CompanyName { get; set; }
        public string Name { get; set; }
        public string BedNo { get; set; }
        public string PIN { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string OR { get; set; }
        public string FromDateTime { get; set; }
        public string ToDateTime { get; set; }
        public string Operation { get; set; }
        public string Surgeon { get; set; }
        public string Anaesthetist { get; set; }
        public string Anaesthesia { get; set; }
    }
    public class MainListOTSchedule
    {
        public int ctr { get; set; }
        public int OtId { get; set; }
        public string RegistrationNo { get; set; }
        public string PTName { get; set; }
        public string BedName { get; set; }
        public string OTName { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string Surgeon { get; set; }
        public string Surgery { get; set; }
        public string Anas { get; set; }
        public string OTStart { get; set; }
        public string OTEnd { get; set; }
        public string Remarks { get; set; }
        public string Rheader { get; set; }
        public string Raddress { get; set; }
        //public int ID { get; set; }
        //public int ctr { get; set; }
        //public string CompanyName { get; set; }
        //public string Name { get; set; }
        //public string BedNo { get; set; }
        //public string PIN { get; set; }
        //public string Age { get; set; }
        //public string Sex { get; set; }
        //public string OR { get; set; }
        //public string FromDateTime { get; set; }
        //public string ToDateTime { get; set; }
        //public string Operation { get; set; }
        //public string Surgeon { get; set; }
        //public string Anaesthetist { get; set; }
        //public string Remarks { get; set; }
    }
    public class MainListOTSchedulev2
    {
        //public int ctr { get; set; }
        //public int OtId { get; set; }
        //public string RegistrationNo { get; set; }
        //public string PTName { get; set; }
        //public string BedName { get; set; }
        //public string OTName { get; set; }
        //public string Age { get; set; }
        //public string Sex { get; set; }
        //public string Surgeon { get; set; }
        //public string Surgery { get; set; }
        //public string Anas { get; set; }
        //public string OTStart { get; set; }
        //public string OTEnd { get; set; }
        //public string Remarks { get; set; }
        //public string Rheader { get; set; }
        //public string Raddress { get; set; }
        public int ID { get; set; }
        public int ctr { get; set; }
        public string CompanyName { get; set; }
        public string Name { get; set; }
        public string BedNo { get; set; }
        public string PIN { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string OR { get; set; }
        public string FromDateTime { get; set; }
        public string ToDateTime { get; set; }
        public string Operation { get; set; }
        public string Surgeon { get; set; }
        public string Anaesthetist { get; set; }
        public string Remarks { get; set; }
    }
    public class MainListSurgeonWiseSchedule
    {
        public int ID { get; set; }
        public int ctr { get; set; }
        public string OTNo { get; set; }
        public string FromDateTime { get; set; }
        public string ToDateTime { get; set; }
        public string Name { get; set; }
        public string Age { get; set; }
        public string BedNo { get; set; }
        public string Ward { get; set; }
        public string Surgery { get; set; }
        public string Anaesthetist { get; set; }
        public string Anaesthesia { get; set; }
        public string Remarks { get; set; }
    }

    #endregion

    #region select2

    public class Select2OTReportDepartmentRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2OTReportDepartmentRepository";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<IdName> queryable { get; set; }

        private static IList<IdName> toIList;
        public IList<IdName> ToIList
        {
            get { return toIList; }
            set { toIList = value; }
        }


        #endregion

        #region INSTRUCTION: Alter the constructor
        /* 1.   Constructors enable the programmer to set default values. The constructor is same name with you're class.
                example:
                public SurgeryDepartmentRepository()
                {
                    queryable = Generate();
                }         
        */

        public Select2OTReportDepartmentRepository()
        {

        }

        private bool _putOnSession = false;
        public bool PutOnSession
        {
            get { return _putOnSession; }
            set { _putOnSession = value; }
        }

        #endregion

        #region INSTRUCTION: Alter the Generate method.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          private IQueryable<SurgeryDepartment> Generate()
        public IQueryable<IdName> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<IdName>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@IPID", -1)
            //};
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2OTReportDepartment");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<IdName> results = dt.ToList<IdName>();

            #endregion

            #region INSTRUCTION: NOLI ME TANGER (touch me not)

            var result = results.AsQueryable();
            queryable = result;
            HttpContext.Current.Cache[CACHE_KEY] = result;

            return result;

            #endregion
        }


        #endregion

        #region INSTRUCTION: Our search term

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: private IQueryable<SurgeryDepartment> GetQuery(string searchTerm)
        private IQueryable<IdName> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            #region INSTRUCTION: Add search parameters if necessary.

            //example:
            //    return queryable.Where
            //            (
            //                a =>
            //                a.name.Like(searchTerm) ||
            //                a.description.Like(searchTerm) ||
            //                a.nth.Like(searchTerm)
            //            );
            return queryable.Where(a => a.name.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<IdName> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm)
                .Skip(pageSize * (pageNum - 1))
                .Take(pageSize)
                .ToList();
        }

        #endregion

        #region INSTRUCTION:

        public Select2PagedResult Paged(string searchTerm, int pageSize, int pageNum)
        {
            List<IdName> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name
                }
            }).ToList();

            paged.Total = count;

            return paged;

        }

        #endregion

        #region Method: GetCount - NOLI ME TANGERE (touch me not)

        //And the total count of records
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }

        #endregion

    }
    public class Select2ReportOperationTheatreRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "#Select2ReportOperationTheatreRepository#";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<IdName> queryable { get; set; }

        private static IList<IdName> toIList;
        public IList<IdName> ToIList
        {
            get { return toIList; }
            set { toIList = value; }
        }


        #endregion

        #region INSTRUCTION: Alter the constructor
        /* 1.   Constructors enable the programmer to set default values. The constructor is same name with you're class.
                example:
                public SurgeryDepartmentRepository()
                {
                    queryable = Generate();
                }         
        */

        public Select2ReportOperationTheatreRepository()
        {

        }

        private bool _putOnSession = false;
        public bool PutOnSession
        {
            get { return _putOnSession; }
            set { _putOnSession = value; }
        }

        #endregion

        #region INSTRUCTION: Alter the Generate method.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          private IQueryable<SurgeryDepartment> Generate()
        public IQueryable<IdName> Fetch(int stationId)
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<IdName>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@stationId", stationId)
            };
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2ReportOperationTheatre");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<IdName> results = dt.ToList<IdName>();

            #endregion

            #region INSTRUCTION: NOLI ME TANGER (touch me not)

            var result = results.AsQueryable();
            queryable = result;
            HttpContext.Current.Cache[CACHE_KEY] = result;

            return result;

            #endregion
        }


        #endregion

        #region INSTRUCTION: Our search term

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: private IQueryable<SurgeryDepartment> GetQuery(string searchTerm)
        private IQueryable<IdName> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            #region INSTRUCTION: Add search parameters if necessary.

            //example:
            //    return queryable.Where
            //            (
            //                a =>
            //                a.name.Like(searchTerm) ||
            //                a.description.Like(searchTerm) ||
            //                a.nth.Like(searchTerm)
            //            );
            return queryable.Where(a => a.name.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<IdName> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm)
                .Skip(pageSize * (pageNum - 1))
                .Take(pageSize)
                .ToList();
        }

        #endregion

        #region INSTRUCTION:

        public Select2PagedResult Paged(string searchTerm, int pageSize, int pageNum)
        {
            List<IdName> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name
                }
            }).ToList();

            paged.Total = count;

            return paged;

        }

        #endregion

        #region Method: GetCount - NOLI ME TANGERE (touch me not)

        //And the total count of records
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }

        #endregion

    }
    public class Select2ReportSurgeonRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "#Select2ReportSurgeonRepository#";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<IdName> queryable { get; set; }

        private static IList<IdName> toIList;
        public IList<IdName> ToIList
        {
            get { return toIList; }
            set { toIList = value; }
        }


        #endregion

        #region INSTRUCTION: Alter the constructor
        /* 1.   Constructors enable the programmer to set default values. The constructor is same name with you're class.
                example:
                public SurgeryDepartmentRepository()
                {
                    queryable = Generate();
                }         
        */

        public Select2ReportSurgeonRepository()
        {

        }

        private bool _putOnSession = false;
        public bool PutOnSession
        {
            get { return _putOnSession; }
            set { _putOnSession = value; }
        }

        #endregion

        #region INSTRUCTION: Alter the Generate method.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          private IQueryable<SurgeryDepartment> Generate()
        public IQueryable<IdName> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<IdName>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@stationId", stationId)
            //};
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2ReportSurgeon");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<IdName> results = dt.ToList<IdName>();

            #endregion

            #region INSTRUCTION: NOLI ME TANGER (touch me not)

            var result = results.AsQueryable();
            queryable = result;
            HttpContext.Current.Cache[CACHE_KEY] = result;

            return result;

            #endregion
        }


        #endregion

        #region INSTRUCTION: Our search term

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: private IQueryable<SurgeryDepartment> GetQuery(string searchTerm)
        private IQueryable<IdName> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            #region INSTRUCTION: Add search parameters if necessary.

            //example:
            //    return queryable.Where
            //            (
            //                a =>
            //                a.name.Like(searchTerm) ||
            //                a.description.Like(searchTerm) ||
            //                a.nth.Like(searchTerm)
            //            );
            return queryable.Where(a => a.name.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<IdName> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm)
                .Skip(pageSize * (pageNum - 1))
                .Take(pageSize)
                .ToList();
        }

        #endregion

        #region INSTRUCTION:

        public Select2PagedResult Paged(string searchTerm, int pageSize, int pageNum)
        {
            List<IdName> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name
                }
            }).ToList();

            paged.Total = count;

            return paged;

        }

        #endregion

        #region Method: GetCount - NOLI ME TANGERE (touch me not)

        //And the total count of records
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }

        #endregion

    }

    #endregion


    public class FilterDailyORListDoneModel
    {

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
       
    }

}
