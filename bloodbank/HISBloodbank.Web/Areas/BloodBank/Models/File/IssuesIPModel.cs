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
    public class IssuesIPModel
    {
        public string ErrorMessage { get; set; }

        public bool Save(IPIssuedSaveHeader entry)
        {

            try
            {
                List<IPIssuedSaveHeader> IPIssuedSaveHeader = new List<IPIssuedSaveHeader>();
                IPIssuedSaveHeader.Add(entry);

                List<IPIssuedSaveDetails> IPIssuedSaveDetails = entry.IPIssuedSaveDetails;
                if (IPIssuedSaveDetails == null) IPIssuedSaveDetails = new List<IPIssuedSaveDetails>();

                //List<CrossMatchSaveDetails> CrossMatchSaveDetails = entry.CrossMatchSaveDetails;
                //if (CrossMatchSaveDetails == null) CrossMatchSaveDetails = new List<CrossMatchSaveDetails>();



                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlIPIssuedSaveHeader",IPIssuedSaveHeader.ListToXml("IPIssuedSaveHeader")),
                    new SqlParameter("@xmIPIssuedSaveDetails", IPIssuedSaveDetails.ListToXml("IPIssuedSaveDetails")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.IPIssuedSave_SCS");
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

        public List<IssuesIPDashboard> IssuesIPDashboard(int Option)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@Option", Option)
  
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IssuesIP_DashBoard_SCS");
            List<IssuesIPDashboard> list = new List<IssuesIPDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssuesIPDashboard>();
            return list;
        }

        public List<IssueIPHeaderDetails> ShowSelected(int OrderNo, int IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo),
                new SqlParameter("@IPID", IPID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IssueIPFetchHeader_SCS");

            List<IssueIPHeaderDetails> list = new List<IssueIPHeaderDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueIPHeaderDetails>();
            if (OrderNo != -1 && dt.Rows.Count > 0)
            {
            
                list[0].WardDemandOrderDetails = this.WardDemandOrderDetails(OrderNo,IPID);
                list[0].IssueBagDetails = this.IssueBagDetails(OrderNo, IPID);
                list[0].CrossMatchBagAvailable = this.CrossMatchBagAvailable(OrderNo, IPID);
                list[0].ReplacementDonor = this.ReplacementDonor(OrderNo, IPID);
               
            }
            return list;

        }

        private List<ReplacementDonor> ReplacementDonor(int @OrderNo, int @IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo), 
                new SqlParameter("@IPID", IPID)
      
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.ReplacementDonor_SCS");

            List<ReplacementDonor> list = new List<ReplacementDonor>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReplacementDonor>();
            return list;

        }

        public List<IpIssueCrossmatchAvailmodel> IpIssueCrossmatchAvailmodel(int OrderNo, int IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo),     
                new SqlParameter("@IPID", IPID)
                //new SqlParameter("@BGroup", BGroup)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IPIssuesCrossBagAvailable_SCS");

            List<IpIssueCrossmatchAvailmodel> list = new List<IpIssueCrossmatchAvailmodel>();
            if (dt.Rows.Count > 0) list = dt.ToList<IpIssueCrossmatchAvailmodel>();
            return list;
        }

        private List<WardDemandOrderDetails> WardDemandOrderDetails(int @OrderNo, int @IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo), 
                new SqlParameter("@IPID", IPID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IPIssuesWardOrder_SCS");

            List<WardDemandOrderDetails> list = new List<WardDemandOrderDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<WardDemandOrderDetails>();
            return list;

        }

        private List<IssueBagDetails> IssueBagDetails(int @OrderNo, int @IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo), 
                new SqlParameter("@IPID", IPID)
      
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IPIssuesBagOrder_SCS");

            List<IssueBagDetails> list = new List<IssueBagDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueBagDetails>();
            return list;

        }

        private List<CrossMatchBagAvailable> CrossMatchBagAvailable(int @OrderNo, int @IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderNo", OrderNo), 
                new SqlParameter("@IPID", IPID)
      
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.CrossMatchBagAvailable_SCS");

            List<CrossMatchBagAvailable> list = new List<CrossMatchBagAvailable>();
            if (dt.Rows.Count > 0) list = dt.ToList<CrossMatchBagAvailable>();
            return list;

        }

    }


    public class IPIssuedSaveHeader 
    {
        public int Action { get; set; }
        public int IPID { get; set; }
        public int BedID { get; set; }
        public int StationID { get; set; }
        public int WardID { get; set; }
        public int operatorid { get; set; }
        public int ReceivedBy { get; set; }
        public int DoctorID { get; set; }
        public int Remarks { get; set; }
        public int DemandID { get; set; }
        public string CollectedBy { get; set; }
        public int OrderNo { get; set; }
        public List<IPIssuedSaveDetails> IPIssuedSaveDetails { get; set; }
    }

    public class IPIssuedSaveDetails
    {
        public string BagNumber { get; set; }
        public int ComponentID { get; set; }
        public int VolumeIssued { get; set; }
        public int CrossID { get; set; }
        public string ExpiryDate { get; set; }
        public int TransfusionType { get; set; }
        public int BagGroup { get; set; }
        public int PatBloodGroup { get; set; }
        public int ComponentType { get; set; }
        public int BagID { get; set; }
        public int ReplacementBags { get; set; }
        public int transtype { get; set; }
    }


    public class IssuesIPDashboard 
    {

        public int orderno { get; set; }
        public string odatetime { get; set; }
        public string PIN { get; set; }
        public string Bed { get; set; }
        public string Patientname { get; set; }
        public string operatorname { get; set; }
        public string Status { get; set; }
        public string RegNo { get; set; }
        public string IPID { get; set; }
        public string AuthorityCode { get; set; }
        public string id { get; set; }
        public string boperatorid { get; set; }

    }

    public class IssueIPHeaderDetails 
    {
        public string orderno { get; set; }
        public string IPID { get; set; }
        public string odatetime { get; set; }
        public string PIN { get; set; }
        public string Patientname { get; set; }
        public string bedid { get; set; }
        public string Bed { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string SexName { get; set; }
        public string BloodGroup { get; set; }
        public string DoctorName { get; set; }
        public string DoctorId { get; set; }
        public string OtherAllergies { get; set; }
        public string Ward { get; set; }
        public string StationId { get; set; }
        public string TransfusionName { get; set; }
        public string Transfusion { get; set; }
        public string clinicaldetails { get; set; }
        //public string Staldetails { get; set; }
        public string Issuedby { get; set; }
        public string RegNo { get; set; }
        public string AuthorityCode { get; set; }
        public string id { get; set; }
        public string boperatorid { get; set; }
        public string wbc { get; set; }
        public string rbc { get; set; }
        public string hb { get; set; }
        public string pcv { get; set; }
        public string platelet { get; set; }
        public string others { get; set; }
        public string PTTK { get; set; }
        public string CollectedBy { get; set; }
        public List<WardDemandOrderDetails> WardDemandOrderDetails { get; set; }
        public List<IssueBagDetails> IssueBagDetails { get; set; }
        public List<CrossMatchBagAvailable> CrossMatchBagAvailable { get; set; }
        public List<ReplacementDonor> ReplacementDonor { get; set; }
    }

    public class ReplacementDonor 
    {
        public string Issued { get; set; }
        public string Donated { get; set; }
        public string DonorRegistrationNO { get; set; }
    }

    public class WardDemandOrderDetails
    {
        public int ctr { get; set; }
        public string Name { get; set; }
        public string TempName { get; set; }
        public int BloodOrderID { get; set; }
        public int Quantity { get; set; }
        public int OQty { get; set; }
        public int ComponentID { get; set; }
        public int ID { get; set; }
        public int Type {get; set;}
        public int replacementcount { get; set; }
     

    }


    public class IpIssueCrossmatchAvailmodel
    {
        public string UnitNo { get; set; }
        public string bloodgroup { get; set; }
        public string Expirydate { get; set; }
        public string ID { get; set; }
        public string componentid { get; set; }
        public string bagId { get; set; }
        public string replacementcount { get; set; }
        public string Qty { get; set; }
        public string IssueCode { get; set; }
        public string bloodgroupId { get; set; }
        public string ComponentTypeId { get; set; }
        public string transtype { get; set; }
        public string patbloodgroup { get; set; }
    }

    public class IssueBagDetails
    {
        //public int ctr { get; set; }
        public string UnitNo { get; set; }
        public string bloodgroup { get; set; }
        public string Expirydate { get; set; }
        public string ID { get; set; }
        public string componentid { get; set; }
        public string bagId { get; set; }
        public string replacementcount { get; set; }
        public string Qty { get; set; }
        public string IssueCode { get; set; }
        public string bloodgroupId { get; set; }
        public string ComponentTypeId { get; set; }
        public string transtype { get; set; }
        public string patbloodgroup { get; set; }
    }

    public class CrossMatchBagAvailable
    {
        //public int ctr { get; set; }
        public string UnitNo { get; set; }
        public string bloodgroup { get; set; }
        public string Expirydate { get; set; }
        public string ID { get; set; }
        public string componentid { get; set; }
        public string bagId { get; set; }
        public string replacementcount { get; set; }
        public string Qty { get; set; }
        public string IssueCode { get; set; }
        public string bloodgroupId { get; set; }
        public string ComponentTypeId { get; set; }
        public string transtype { get; set; }
        public string patbloodgroup { get; set; }

    }




    #region Select2

    public class Select2WardRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2WardRepository";

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

        public Select2WardRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2Station");

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

    public class SelectIssuedByRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "SelectIssuedByRepository";

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

        public SelectIssuedByRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2IssueBy");

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