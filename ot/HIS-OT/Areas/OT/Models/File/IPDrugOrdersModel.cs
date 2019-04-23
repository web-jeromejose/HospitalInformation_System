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
    public class IPDrugOrdersModel
    {
        public string ErrorMessage { get; set; }

        public List<MainListIPDrugOrder> List(int stationID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@stationID", stationID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.MainListIPDrugOrder");

            List<MainListIPDrugOrder> list = new List<MainListIPDrugOrder>();
            if (dt.Rows.Count > 0) list = dt.ToList<MainListIPDrugOrder>();
            return list;
        }
        public List<Drugorder> ShowSelected(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ID", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetDrugOrder");
            List<Drugorder> list = new List<Drugorder>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<Drugorder>();
                list[0].DrugList = this.GetDrugList(Id);
                list[0].InpatientDetails = this.GetInpatientDetails(list[0].IPID);
                list[0].IssuedDrugs = this.GetIssuedDrugList(Id);
                list[0].DrugAllergies = this.GetDrugAllergiesList(list[0].IPID);
            }

            return list;
        }

        public bool Save(Drugorder entry)
        {
            try
            {
                List<Drugorder> Drugorder = new List<Drugorder>();
                Drugorder.Add(entry);

                List<DrugOrderDetail> DrugOrderDetail = entry.DrugOrderDetail;
                if (DrugOrderDetail == null) DrugOrderDetail = new List<DrugOrderDetail>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlDrugorder",Drugorder.ListToXml("Drugorder")),
                    new SqlParameter("@xmlDrugOrderDetail",DrugOrderDetail.ListToXml("DrugOrderDetail"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("OT.OT_WARDS_DRUGORDER_SAVE");
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

        public List<M_Generic> DrugAllergiesList(int IPID)
        {
            return this.GetDrugAllergiesList(IPID);
        }
        public List<IssuedDrugs> IssuedDrugList(int orderid)
        {
            return this.GetIssuedDrugList(orderid);
        }
        public List<SearchDrugEntity> SearchDrugs(string search)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@search", search)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.SearchDrugs");
            List<SearchDrugEntity> list = new List<SearchDrugEntity>();
            if (dt.Rows.Count > 0) list = dt.ToList<SearchDrugEntity>();
            return list;
        }

        private List<DrugList> GetDrugList(int OrderID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OrderID", OrderID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.IPDrugOrderDrugList");

            List<DrugList> list = new List<DrugList>();
            if (dt.Rows.Count > 0) list = dt.ToList<DrugList>();
            return list;
        }
        private List<M_Generic> GetDrugAllergiesList(int IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@IPID", IPID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.IPDrugOrderAllergyDrug");

            List<M_Generic> list = new List<M_Generic>();
            if (dt.Rows.Count > 0) list = dt.ToList<M_Generic>();
            return list;
        }
        private List<Select2InpatientsEntity> GetInpatientDetails(int IPID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@IPID", IPID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.Select2Inpatients");
            List<Select2InpatientsEntity> list = new List<Select2InpatientsEntity>();
            if (dt.Rows.Count > 0) list = dt.ToList<Select2InpatientsEntity>();
            return list;
        }
        private List<IssuedDrugs> GetIssuedDrugList(int orderid)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@orderid", orderid)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.IPDrugOrderIssuedDrugs");
            List<IssuedDrugs> list = new List<IssuedDrugs>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssuedDrugs>();
            return list;
        }

    }


    public class Drugorder
    {
        public int Action { get; set; } 
        public int ID { get; set; } 
        public int BedID { get; set; } 
        public int IPID { get; set; } 
        public int StationID { get; set; } 
        public int OperatorID { get; set; } 
        public string DateTime { get; set; } 
        public int DoctorID { get; set; } 
        public int Ackwd { get; set; } 
        public int Dispatched { get; set; } 
        public int PharmacyOperatorID { get; set; } 
        public string PRINTSTATUS { get; set; } 
        public string DispatchedDateTime { get; set; } 
        public int ProfileId { get; set; } 
        public int ToStationId { get; set; } 
        public int stationSlNo { get; set; } 
        public bool OrderType { get; set; } 
        public int PrescriptionID { get; set; } 
        public string BulkProcessDate { get; set; } 
        public bool CSSDItem { get; set; } 
        public bool CSSDStatus { get; set; } 
        public int TransDoneFromStationID { get; set; } 
        public string TransDatetime { get; set; } 
        public int ISTAKEHOME { get; set; } 
        public int pharmacistid { get; set; } 
        public int PRESID { get; set; } 
        public int IsPartial { get; set; } 
        public int AsstPharmacistid { get; set; } 
        public int UPLOADED { get; set; } 
        public string UDATETIME { get; set; } 

        public string OperatorName { get; set; }
        public string RequestType { get; set; }
        public string BedName { get; set; }
        public int CurrentStationID { get; set; } 

        public List<DrugOrderDetail> DrugOrderDetail { get; set; }
        public List<DrugList> DrugList { get; set; }
        public List<M_Generic> DrugAllergies { get; set; }
        public List<Select2InpatientsEntity> InpatientDetails { get; set; }
        public List<IssuedDrugs> IssuedDrugs { get; set; }

    }
    public class DrugOrderDetail
    {
        public int OrderID { get; set; }
        public int SqNo { get; set; }
        public int ServiceID { get; set; }
        public string Remarks { get; set; }
        public int SubstituteID { get; set; }
        public int BatchID { get; set; }
        public string BatchNo { get; set; }
        public decimal DispatchQuantity { get; set; }
        public int unitid { get; set; }
        public decimal Price { get; set; }
        public string RouteOfAdmin { get; set; }
        public int BeforeAfter { get; set; }
        public string strength { get; set; }
        public int strength_no { get; set; }
        public int Duration_ID { get; set; }
        public int Frequency_ID { get; set; }
        public int Duration_No { get; set; }
        public int Quantity { get; set; }
        public bool BrandType { get; set; }
    }

    public class MainListIPDrugOrder
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public string OrderNo { get; set; }
        public int IPID { get; set; }
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public string Bed { get; set; }
        public string datetime { get; set; }
        public int stationslno { get; set; }
        public string prefix { get; set; }
        public string Operator { get; set; }
        public int Dispatched { get; set; }
        public string Station { get; set; }
        public int Acknowledged { get; set; }
        public int operatorid { get; set; }
        public string DocName { get; set; }

        public List<Select2InpatientsEntity> Select2InpatientsEntity { get; set; }

    }
    public class DrugList
    {
        public int ServiceID { get; set; }
        public int SqNo { get; set; }
        public string DrugName { get; set; }
        public string Units { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; }
        public int UnitId { get; set; }
    }
    public class IssuedDrugs
    {
        public int id { get; set; }
        public int ctr { get; set; }
        public int drugtype { get; set; }
        public string DrugName { get; set; }
        public decimal DispatchQuantity { get; set; }
        public int UnitID { get; set; }
        public string Units { get; set; }
        public string SubDrugName { get; set; }
        public string remarks { get; set; }
    }
    public class M_Generic
    {
        public int ID { get; set; }
        public int ctr { get; set; }
        public string Name { get; set; }
        public string GenericCode { get; set; }
        public string StartDateTime { get; set; }
        public string EndDatetime { get; set; }
        public int OperatorID { get; set; }
        public bool Deleted { get; set; }
        public int Hipar { get; set; }
        public int HiparGenericID { get; set; }
        public string ts { get; set; }
        public string Description { get; set; }
        public string Comments { get; set; }
        public string ContraIndications { get; set; }
        public string Cautions { get; set; }
        public string SideEffects { get; set; }
        public string Dose { get; set; }
        public string AppLever { get; set; }
        public string AppRenal { get; set; }
        public string AppPregnancy { get; set; }
        public string AppBreastFeed { get; set; }
        public string AppIntraAdditives { get; set; }
    }
    public class SearchDrugEntity
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string Unit { get; set; }
        public int Qty { get; set; }
        public int UnitId { get; set; }
    }
    public class Select2InpatientsEntity
    {
        public int Stationid { get; set; }
        public int status { get; set; }
        public string PIN { get; set; }
        public int BedId { get; set; }
        public string Bed { get; set; }
        public string PatientName { get; set; }
        public int DoctorId { get; set; }
        public string Doctor { get; set; }
        public int IPID { get; set; }
        public string Ward { get; set; }
        public string Package { get; set; }
        public string Company { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string BloodGroup { get; set; }
    }




    public class Select2InpatientsRepositoryPIN
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2InpatientsRepositoryPIN";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<Select2InpatientsEntity> queryable { get; set; }

        private static IList<Select2InpatientsEntity> toIList;
        public IList<Select2InpatientsEntity> ToIList
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

        public Select2InpatientsRepositoryPIN()
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
        public IQueryable<Select2InpatientsEntity> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<Select2InpatientsEntity>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@IPID", -1)
            };
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2Inpatients");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<Select2InpatientsEntity> results = dt.ToList<Select2InpatientsEntity>();

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
        private IQueryable<Select2InpatientsEntity> GetQuery(string searchTerm)
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
            return queryable.Where(a => a.PIN.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<Select2InpatientsEntity> Get(string searchTerm, int pageSize, int pageNum)
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
            List<Select2InpatientsEntity> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.IPID.ToString(),
                text = m.PIN,
                list = new object[] {
                    m.Stationid.ToString(), m.status.ToString(), m.PIN,
                    m.BedId.ToString(), m.Bed, m.PatientName, m.DoctorId.ToString(),
                    m.Doctor, m.IPID.ToString(), m.Ward, m.Package,
                    m.Company, m.Age, m.Sex, m.BloodGroup
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
    public class Select2InpatientsRepositoryName
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2InpatientsRepositoryName";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<Select2InpatientsEntity> queryable { get; set; }

        private static IList<Select2InpatientsEntity> toIList;
        public IList<Select2InpatientsEntity> ToIList
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

        public Select2InpatientsRepositoryName()
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
        public IQueryable<Select2InpatientsEntity> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<Select2InpatientsEntity>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();            
            db.param = new SqlParameter[] {
                new SqlParameter("@IPID", -1)
            };
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2Inpatients");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<Select2InpatientsEntity> results = dt.ToList<Select2InpatientsEntity>();

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
        private IQueryable<Select2InpatientsEntity> GetQuery(string searchTerm)
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
            return queryable.Where(a => a.PatientName.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<Select2InpatientsEntity> Get(string searchTerm, int pageSize, int pageNum)
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
            List<Select2InpatientsEntity> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.IPID.ToString(),
                text = m.PatientName,
                list = new object[] {
                    m.Stationid.ToString(), m.status.ToString(), m.PIN,
                    m.BedId.ToString(), m.Bed, m.PatientName, m.DoctorId.ToString(),
                    m.Doctor, m.IPID.ToString(), m.Ward, m.Package,
                    m.Company, m.Age, m.Sex, m.BloodGroup
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
    public class Select2InpatientsRepositoryBedNo
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2InpatientsRepositoryBedNo";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<Select2InpatientsEntity> queryable { get; set; }

        private static IList<Select2InpatientsEntity> toIList;
        public IList<Select2InpatientsEntity> ToIList
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

        public Select2InpatientsRepositoryBedNo()
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
        public IQueryable<Select2InpatientsEntity> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<Select2InpatientsEntity>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@IPID", -1)
            };
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2Inpatients");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<Select2InpatientsEntity> results = dt.ToList<Select2InpatientsEntity>();

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
        private IQueryable<Select2InpatientsEntity> GetQuery(string searchTerm)
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
            return queryable.Where(a => a.Bed.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<Select2InpatientsEntity> Get(string searchTerm, int pageSize, int pageNum)
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
            List<Select2InpatientsEntity> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.IPID.ToString(),
                text = m.Bed,
                list = new object[] {
                    m.Stationid.ToString(), m.status.ToString(), m.PIN,
                    m.BedId.ToString(), m.Bed, m.PatientName, m.DoctorId.ToString(),
                    m.Doctor, m.IPID.ToString(), m.Ward, m.Package,
                    m.Company, m.Age, m.Sex, m.BloodGroup
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
    public class Select2InpatientsRepositoryDoctor
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2InpatientsRepositoryDoctor";

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

        public Select2InpatientsRepositoryDoctor()
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
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2InpatientDoctors");

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

}