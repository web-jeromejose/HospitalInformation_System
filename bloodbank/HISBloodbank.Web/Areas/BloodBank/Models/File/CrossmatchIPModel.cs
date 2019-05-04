using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;

namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class CrossmatchIPModel
    {
        public string ErrorMessage { get; set; }

        public bool SaveMaxLab(SaveMaxLabNo entry)
        {

            try
            {
                List<SaveMaxLabNo> SaveMaxLabNo = new List<SaveMaxLabNo>();
                SaveMaxLabNo.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlSaveMaxLabNo",SaveMaxLabNo.ListToXml("SaveMaxLabNo"))

                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.SaveMaxLabNo_SCS");
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

        public bool Save(CrossMatchSaveHeader entry)
        {

            try
            {
                List<CrossMatchSaveHeader> CrossMatchSaveHeader = new List<CrossMatchSaveHeader>();
                CrossMatchSaveHeader.Add(entry);

                List<CrossMatchSaveDetails> CrossMatchSaveDetails = entry.CrossMatchSaveDetails;
                if (CrossMatchSaveDetails == null) CrossMatchSaveDetails = new List<CrossMatchSaveDetails>();

                //List<CrossMatchSaveDetails> CrossMatchSaveDetails = entry.CrossMatchSaveDetails;
                //if (CrossMatchSaveDetails == null) CrossMatchSaveDetails = new List<CrossMatchSaveDetails>();



                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCrossMatchSaveHeader",CrossMatchSaveHeader.ListToXml("CrossMatchSaveHeader")),
                    new SqlParameter("@xmlCrossMatchSaveDetails", CrossMatchSaveDetails.ListToXml("CrossMatchSaveDetails")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.CrossMatchReserevedSave_SCS");
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

        public bool SaveUnReserved(ReservedExtendSaveHeader entry)
        {

            try
            {
                List<ReservedExtendSaveHeader> ReservedExtendSaveHeader = new List<ReservedExtendSaveHeader>();
                ReservedExtendSaveHeader.Add(entry);

                List<ReservedExtendSaveDetails> ReservedExtendSaveDetails = entry.ReservedExtendSaveDetails;
                if (ReservedExtendSaveDetails == null) ReservedExtendSaveDetails = new List<ReservedExtendSaveDetails>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReservedExtendSaveHeader",ReservedExtendSaveHeader.ListToXml("ReservedExtendSaveHeader")),
                    new SqlParameter("@xmlReservedExtendSaveDetails",ReservedExtendSaveDetails.ListToXml("ReservedExtendSaveDetails"))

                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.ReserveExtended_SCS");
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

        public List<MainListCrossmatchIP> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListCrossmatchIP");
            List<MainListCrossmatchIP> list = new List<MainListCrossmatchIP>();
            if (dt.Rows.Count > 0) list = dt.ToList<MainListCrossmatchIP>();
            return list;

        }

        public List<MainListCrossmatchIP> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListCrossmatchIP_SCS");

            List<MainListCrossmatchIP> list = new List<MainListCrossmatchIP>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<MainListCrossmatchIP>();
                list[0].WardsOrder = this.GetWardsOrder(id, list[0].Ipid);
                list[0].AvailQuantity = this.GetAvailQuantity(id);
                list[0].BloodOrder = this.GetBloodOrder(id);
                list[0].InPatient = this.GetInPatient(list[0].Ipid);
                //list[0].CrossmatchCompatibiliy = this.GetCrossmatchCompatibiliy(id);
                //list[0].CrossmatchValue = this.GetCrossmatchValue(id);
                list[0].PreviousResult = this.GetPreviousResult(list[0].InPatient[0].RegistrationNo);
            }
            return list;

        }

        public List<IssueingQuantity> IssueingQuantity(int OrderNo, int ComponentId, int BGroup)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo),     
                new SqlParameter("@ComponentId", ComponentId),
                new SqlParameter("@BGroup", BGroup)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.QuantityAvailable_SCS");

            List<IssueingQuantity> list = new List<IssueingQuantity>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueingQuantity>();
            return list;
        }


        public List<ReservedExtendModel> ReservedExtendModel(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", Id) 
             
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchReservedExtend_SCS");

            List<ReservedExtendModel> list = new List<ReservedExtendModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReservedExtendModel>();
            return list;
        }

        #region Private

        private List<WardsOrder> GetWardsOrder(int id, int IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id), 
                new SqlParameter("@IPID", IPID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchIPWardsOrder");

            List<WardsOrder> list = new List<WardsOrder>();
            if (dt.Rows.Count > 0) list = dt.ToList<WardsOrder>();
            return list;

        }
        private List<AvailQuantity> GetAvailQuantity(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", Id) 
                //new SqlParameter("@IPID", IPID)
      
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchIPIssueingQuantity_SCS");

            List<AvailQuantity> list = new List<AvailQuantity>();
            if (dt.Rows.Count > 0) list = dt.ToList<AvailQuantity>();
            return list;

        }
        private List<BloodOrder> GetBloodOrder(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchIPBloodOrder");

            List<BloodOrder> list = new List<BloodOrder>();
            if (dt.Rows.Count > 0) list = dt.ToList<BloodOrder>();
            return list;

        }
        private List<InPatient> GetInPatient(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchIPInpatient");

            List<InPatient> list = new List<InPatient>();
            if (dt.Rows.Count > 0) list = dt.ToList<InPatient>();
            return list;

        }
        //private List<CrossmatchCompatibiliy> GetCrossmatchCompatibiliy(int id)
        //{
        //    DBHelper db = new DBHelper();
        //    db.param = new SqlParameter[] {
        //        new SqlParameter("@Id", id)
        //    };
        //    DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchIPCompatibility");

        //    List<CrossmatchCompatibiliy> list = new List<CrossmatchCompatibiliy>();
        //    if (dt.Rows.Count > 0) list = dt.ToList<CrossmatchCompatibiliy>();
        //    return list;

        //}
        //private List<CrossmatchValue> GetCrossmatchValue(int id)
        //{
        //    DBHelper db = new DBHelper();
        //    db.param = new SqlParameter[] {
        //        new SqlParameter("@Id", id)
        //    };
        //    DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossmatchIPCrossmatch");

        //    List<CrossmatchValue> list = new List<CrossmatchValue>();
        //    if (dt.Rows.Count > 0) list = dt.ToList<CrossmatchValue>();
        //    return list;

        //}
        private List<PreviousResult> GetPreviousResult(int PIN)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@PIN", PIN)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossMatchIP_ShowLabResultsInBB");//P_SHOWLABRESULTSINBB

            List<PreviousResult> list = new List<PreviousResult>();
            if (dt.Rows.Count > 0) list = dt.ToList<PreviousResult>();
            return list;

        }
        
        #endregion

     
    }




    #region Entity 

    public class ReservedExtendModel
    {
        public int ctr { get; set; }
        public string UnitNo { get; set; }
        public string BGroup { get; set; }
        public string IssueCode { get; set; }
    }

    public class ReservedExtendSaveHeader
    {
        public int Action { get; set; }
        public int OrderNo { get; set; }
        public int OperatorId { get; set; }
        public List<ReservedExtendSaveDetails> ReservedExtendSaveDetails { get; set; }
    }

    public class ReservedExtendSaveDetails
    {
      
        public int ctr { get; set; }
        public string BagNumber { get; set; }
    }

    public class SaveMaxLabNo 
    {
        public int Action { get; set; }
        public int StationID { get; set; }
        public int StatusID { get; set; }
        public int OperatorID { get; set; }
        public int OrderNo { get; set; }

    }

    public class CrossMatchSaveHeader
    {
        public int Action { get; set; }//script
        //public int ID { get; set; }//SQL GetMax
        public int Ipid { get; set; }//header
        public int BedId { get; set; }//header
        public int Doctorid { get; set; }//header
        public int OperatorId { get; set; }//BaseCon
        public int CompatablityId { get; set; }//header
        public int reqtype { get; set; }//header
        public int CrossMatchedById { get; set; }//Script select
        public string CrossMatchtypeId { get; set; }//header
        public int StationId { get; set; }
        public int transtype { get; set; }
        public string RequestedDateTime { get; set; }
        public string antibody { get; set; }//date
        public string OrderNo { get; set; }
        public string BGroup { get; set; }
        public string Remarks { get; set; }
        public List<CrossMatchSaveDetails> CrossMatchSaveDetails { get; set; }
    }

    public class CrossMatchSaveDetails
    {
        //public int ID { get; set; }
        public int ctr { get; set; }
        public int bagid { get; set; }
        public string ExpiryDate { get; set; }
        public int compatabulity { get; set; }
        public string Issued { get; set; }
        public int Reserved { get; set; }
        public int ExtenReserved { get; set; }
        public int patbloodgroup { get; set; }
        public int UnitGroup { get; set; }
        public string BagNumber { get; set; }
        public int ComponentId { get; set; }

   
    }


    //public class CompatablitySaveDetails
    //{ 
    //    public int 
    
    
    //}



    public class PreviousResult
    {
        public string result { get; set; }
        public string registrationno { get; set; }
        public string RESULTDATETIME { get; set; }
        public string Name { get; set; }
    }

    public class MainListCrossmatchIP
    {
        public string ctr { get; set; }
        public string OrderNo { get; set; }
        public string RequestedDateTime { get; set; }
        public int Ipid { get; set; }
        public string PIN { get; set; }
        public string Bed { get; set; }
        public int BedId { get; set; }
        public string Patientname { get; set; }
        public string OperatorName { get; set; }
        public int reqtype { get; set; }
        public int status { get; set; }
        public string Acknowledge { get; set; }
        public string AcknowledgeDateTime { get; set; }
        public string SlNo { get; set; }
        public string Age { get; set; }
        public string Gender { get; set; }
        public string Doctor { get; set; }
        public string Ward { get; set; }
        public string TransfussionType { get; set; }
        public string RequestType { get; set; }
        public string Replacement { get; set; }
        public string AntiBody { get; set; }
        public int AntiBodyId { get; set; }
        public string Remarks { get; set; }
        public int CrossMatchedById { get; set; }
        public string CrossMatchedByName { get; set; }
        public string BloodGroupId { get; set; }
        public string BloodGroupName { get; set; }
        public string sDateTime { get; set; }
        public int CrossMatchId { get; set; }
        public string CrossMatchName { get; set; }
        public int CompatablityId { get; set; }
        public string CompatablityName { get; set; }
        public string transtype { get; set; }
        public int DoctorId { get; set; }
        public List<BloodOrder> BloodOrder { get; set; }
        public List<WardsOrder> WardsOrder { get; set; }
        public List<AvailQuantity> AvailQuantity { get; set; }
        public List<InPatient> InPatient { get; set; }
        //public List<CrossmatchCompatibiliy> CrossmatchCompatibiliy { get; set; }
        //public List<CrossmatchValue> CrossmatchValue { get; set; }
        public List<PreviousResult> PreviousResult { get; set; }

    }
    public class WardsOrder
    {
        public int ctr  { get; set; }
        public string code { get; set; }
        public string quantity { get; set; }
        public string rdatetime { get; set; }
        public string tempname { get; set; }
        public string ComponentId { get; set; }
        public string type { get; set; }
        public string OrderNo { get; set; }
        public string demandqty { get; set; }
    }
    public class AvailQuantity
    {
        public int ctr { get; set; }
        public string UnitNo { get; set; }
        public string BGroup { get; set; }
        public string IssueCode { get; set; }
        //for add and remove only
        public string bagid { get; set; }
        public string ddate { get; set; }
        public string ExpiryDate { get; set; }
        public string bloodname { get; set; }
        public string bloodid { get; set; }
        public string crossstate { get; set; }
        public string Cvolume { get; set; }
        public string IsExpired { get; set; }
        public string TempId { get; set; }
        public string BGId { get; set; }
        public string Status { get; set; }
        public string patbloodgroup { get; set; }
        public string UnitGroup { get; set; }
        public string ComponentId { get; set; }

    } 
    public class CrossmatchCompatibiliy
    {
        public int isChk { get; set; }
        public string Compatibility { get; set; }
    }
    //public class CrossmatchValue
    //{
    //    public int isChk { get; set; }
    //    public string CrossMatchtype { get; set; }
    //}

    public class IssueingQuantity
    {
        public int ctr { get; set; }
        public string bagid { get; set; }
        public string UnitNo { get; set; }
        public string ddate { get; set; }
        public string ExpiryDate { get; set; }
        public string bloodname { get; set; }
        public string bloodid { get; set; }
        public string crossstate { get; set; }
        public string Cvolume { get; set; }
        public string BGroup { get; set; }
        public string BCode { get; set; }
        public string IsExpired { get; set; }
        public string TempId { get; set; }
        public string BGId { get; set; }
        public string Status { get; set; }
        public string patbloodgroup { get; set; }
        public string UnitGroup { get; set; }
        public string ComponentId { get; set; }
    }


    #endregion

    #region Select2

    public class Select2CrossmatchIPBloodGroupRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2CrossmatchIPBloodGroupRepository$";

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

        public Select2CrossmatchIPBloodGroupRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2CrossmatchIPBloodGroup");

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

    public class Select2CrossmatchByRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2CrossmatchByRepository";

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

        public Select2CrossmatchByRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2CrossmatchBy");

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

    public class Select2BGroupRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2BGroupRepository";

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

        public Select2BGroupRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.GetSelected2BCode");

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

    public class Select2CrossMatchTypeRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2CrossMatchRepository";

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

        public Select2CrossMatchTypeRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2CrossMatchType_SCS");

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

    public class Select2CompatablityRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2CompatablityRepository";

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

        public Select2CompatablityRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2Compatablity_SCS");

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


}