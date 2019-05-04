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
    public class ComponentBagTypeMappingModel
    {
        public string ErrorMessage { get; set; }

        public List<BagTypeMapping> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListComponentBagTypeMapping");
            List<BagTypeMapping> list = new List<BagTypeMapping>();
            if (dt.Rows.Count > 0) list = dt.ToList<BagTypeMapping>();
            return list;

        }
        public List<BagTypeMapping> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListComponentBagTypeMapping");
            List<BagTypeMapping> list = new List<BagTypeMapping>();
            if (dt.Rows.Count > 0) list = dt.ToList<BagTypeMapping>();
            return list;
        }
        public List<BagTypeMapping> GetBagTypeMapping(int componentid, int bagtypeid)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@componentid", componentid),
                new SqlParameter("@bagtypeid", bagtypeid)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.GetBagTypeMapping");
            List<BagTypeMapping> list = new List<BagTypeMapping>();
            if (dt.Rows.Count > 0) list = dt.ToList<BagTypeMapping>();
            return list;
        }
        
        public bool Save(BagTypeMapping entry)
        {
            try
            {
                List<BagTypeMapping> BagTypeMapping = new List<BagTypeMapping>();
                BagTypeMapping.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlBagTypeMapping",BagTypeMapping.ListToXml("BagTypeMapping"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterComponentBagTypeMappingSave");
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

    }

    #region select2

    public class Select2ComponentBagTypeRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2ComponentBagTypeRepository$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<GetBagTypeMapping> queryable { get; set; }

        private static IList<GetBagTypeMapping> toIList;
        public IList<GetBagTypeMapping> ToIList
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

        public Select2ComponentBagTypeRepository()
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
        public IQueryable<GetBagTypeMapping> Fetch(int componentid)
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<GetBagTypeMapping>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@componentid", componentid)
            };
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2ComponentBagType");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<GetBagTypeMapping> results = dt.ToList<GetBagTypeMapping>();

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
        private IQueryable<GetBagTypeMapping> GetQuery(string searchTerm)
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
        public List<GetBagTypeMapping> Get(string searchTerm, int pageSize, int pageNum)
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
            List<GetBagTypeMapping> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name, m.expiryperiod.ToString(), m.timeid.ToString(), m.ExpiryName
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
    public class Select2ComponentNameRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2ComponentNameRepository";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<GetBagTypeMapping> queryable { get; set; }

        private static IList<GetBagTypeMapping> toIList;
        public IList<GetBagTypeMapping> ToIList
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

        public Select2ComponentNameRepository()
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
        public IQueryable<GetBagTypeMapping> Fetch(int bagtypeid)
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<GetBagTypeMapping>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@bagtypeid", bagtypeid)
            };
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2ComponentName");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<GetBagTypeMapping> results = dt.ToList<GetBagTypeMapping>();

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
        private IQueryable<GetBagTypeMapping> GetQuery(string searchTerm)
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
        public List<GetBagTypeMapping> Get(string searchTerm, int pageSize, int pageNum)
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
            List<GetBagTypeMapping> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name, m.expiryperiod.ToString(), m.timeid.ToString(), m.ExpiryName
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


    public class GetBagTypeMapping : BagTypeMapping 
    {
        public string id { get; set; }
        public string name { get; set; }
    }



}