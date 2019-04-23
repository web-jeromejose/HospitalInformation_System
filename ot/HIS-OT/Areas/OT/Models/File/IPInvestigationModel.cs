using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using HIS_OT.Models;
using HIS_OT.Controllers;

namespace HIS_OT.Areas.OT.Models
{
    public class IPInvestigationModel
    {
        public string ErrorMessage { get; set; }

        public List<TestRequisition> ShowList(MyFilterIPInvestigation filter)
        {
            List<MyFilterIPInvestigation> f = new List<MyFilterIPInvestigation>();
            f.Add(filter);
            string xml = f.ListToXml("filter");
            f = null;

            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@filter", xml)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.IPInvestigationList");
            List<TestRequisition> list = new List<TestRequisition>();
            if (dt.Rows.Count > 0) list = dt.ToList<TestRequisition>();

            return list;
        }
        public List<TestRequisition> ShowSelected(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ID", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.IPInvestigationSelected");
            List<TestRequisition> list = new List<TestRequisition>();
            bool hasRows = dt.Rows.Count > 0;
            if (hasRows)
            {
                list = dt.ToList<TestRequisition>();
                list[0].RequestedTestSelected = this.GetRequestedTest(Id);
            }

            return list;
        }
        public bool Save(TestRequisition entry)
        {           

            try
            {
                List<TestRequisition> TestRequisition = new List<TestRequisition>();
                TestRequisition.Add(entry);

                List<RequestedTest> RequestedTest = entry.RequestedTest;
                if (RequestedTest == null) RequestedTest = new List<RequestedTest>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlTestRequisition",TestRequisition.ListToXml("TestRequisition")),
                    new SqlParameter("@xmlRequestedTest",RequestedTest.ListToXml("RequestedTest"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("OT.IPInvestigationSave");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }
        public List<SampleCollectionResult> SampleCollectionResultList(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ID", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.SampleCollectionResultList");
            List<SampleCollectionResult> list = new List<SampleCollectionResult>();
            if (dt.Rows.Count > 0) list = dt.ToList<SampleCollectionResult>();
            return list;
        }

        private List<IdName> GetRequestedTest(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ID", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetRequestedTest");
            List<IdName> list = new List<IdName>();
            if (dt.Rows.Count > 0) list = dt.ToList<IdName>();
            return list;
        }

    }



    public class TestRequisition
    {
        public int Action { get; set; }
        public int W { get; set; }
        public int ID { get; set; }
        public int IPID { get; set; }
        public int BedID { get; set; }
        public int SourceStID { get; set; }
        public int Priority { get; set; }
        public string Remarks { get; set; }
        public int DoctorID { get; set; }
        public string ToBeDoneBy { get; set; }
        public int Exstatus { get; set; }
        public int Printed { get; set; }
        public int ToBeDoneAt { get; set; }
        public int Phlebotomy { get; set; }
        public int patientstatus { get; set; }
        public int stationslno { get; set; }
        public int TransDoneFromStationID { get; set; }
        public string TransDatetime { get; set; }
        public string DateTime { get; set; }
        public int OperatorID { get; set; }

        public string PIN { get; set; }
        public string BedNo { get; set; }
        public string Name { get; set; }
        public string Age { get; set; }
        public int GenderId { get; set; }
        public string Gender { get; set; }
        public string BloodGroup { get; set; }
        public string DoctorIdName { get; set; }
        public string OperatorName { get; set; }
        public string RequisitionNo { get; set; }
        public string Ward { get; set; }
        public string Status { get; set; }
                
        public string DateTimeD { get; set; }
        public string ToBeDoneByD { get; set; }
        public string TransDatetimeD { get; set; }
        public string Executed { get; set; }
        public string Stat { get; set; }

        public string OrderNo { get; set; }
        public int CurrentStationID { get; set; }

        public List<RequestedTest> RequestedTest { get; set; }
        public List<IdName> RequestedTestSelected { get; set; }
        public List<SampleCollectionResult> SampleCollectionResult { get; set; }
    }
    public class RequestedTest
    {
        public int OrderID { get; set; }
        public int ServiceID { get; set; }
        public int DestStID { get; set; }
        public int CollectedBy { get; set; }
        public int AcknowledgedBy { get; set; }
        public int TestDoneby { get; set; }
        public string collectedDateTime { get; set; }
        public string AcknowledgeddateTime { get; set; }
        public int CollectedAt { get; set; }
        public string TestDoneDateTime { get; set; }
        public int SampleID { get; set; }
        public int ProfileID { get; set; }
        public int Verified1 { get; set; }
        public int Verifiedby { get; set; }
        public string labnum { get; set; }
        public string ReceivingTime { get; set; }
        public int normal { get; set; }
        public bool bIMAGE { get; set; }
        public string verifieddatetime { get; set; }
        public int scheduleid { get; set; }
        public int ProcDoneStationID { get; set; }
        public int ReportRelese { get; set; }
        public string Comments { get; set; }
        public bool readtest { get; set; }

        public string name { get; set; }
        public int type { get; set; }
        public int TestIChk { get; set; }
        
    }
    public class SampleCollectionResult
    {
        public int SNo { get; set; }
        public string Comments { get; set; }
        public int StationID { get; set; }
        public string StationName { get; set; }
        public int OID { get; set; }
        public string OrderDateTime { get; set; }
        public int DestStID { get; set; }
        public int Requestedby { get; set; }
        public string Code { get; set; }
        public int TestIChk { get; set; }
        public string TestName { get; set; }
        public int TestID { get; set; }
        public int testdoneby { get; set; }
        public int verifiedby { get; set; }
        public int acknowledgedby { get; set; }
        public int collectedby { get; set; }
        public string acknowledgeddatetime { get; set; }
        public int sampleid { get; set; }
        public string Sample { get; set; }
        public int PID { get; set; }
        public string profile { get; set; }
        public int Sequence { get; set; }
        public int ID { get; set; }

        public string OrderNo  { get; set; }
        public int ServiceID { get; set; }
        public string Stat { get; set; }

    }

    public class MyFilterIPInvestigation
    {
        public string FromDateF { get; set; }
        public string FromDateT { get; set; }
        public int StationId { get; set; }
        public int CurrentStationID { get; set; }
    }

    public class Select2GetLabPatientStatusRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2GetLabPatientStatusRepository$";

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

        public Select2GetLabPatientStatusRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2GetLabPatientStatus");

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
    public class Select2GetAllTestRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2GetAllTestRepository$";

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

        public Select2GetAllTestRepository()
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
        public IQueryable<IdName> Fetch(int AllTest)
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
                new SqlParameter("@AllTest",AllTest)
            };
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2GetAllTest");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            //List<LabelValue> results = dt.ToList<LabelValue>();
            List<IdName> results = dt.AsEnumerable().Select(
            m => new IdName()
            {
                id = m.Field<int>("id"),
                name = m.Field<string>("name"),
                type = m.Field<int>("type"),
            }).ToList();

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



}

