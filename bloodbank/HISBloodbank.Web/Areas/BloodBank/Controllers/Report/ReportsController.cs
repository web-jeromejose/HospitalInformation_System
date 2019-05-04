using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data;

using DataLayer;
using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Areas.BloodBank.Controllers;
using HIS_BloodBank.Models;
using HIS_BloodBank.Controllers;



namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class ReportsController : BaseController
    {
        //
        // GET: /BloodBank/Reports/

        public ActionResult RptBloodDonorScreening()
        {
            return View();
        }
        public ActionResult RptBloodUsage()
        {
            return View();
        }
        public ActionResult RptDoctorWiseBloodUsage()
        {
            return View();
        }
        public ActionResult RptDonorGroupWiseList()
        {
            return View();
        }
        public ActionResult RptGroupWiseStock()
        {
            return View();
        }
        public ActionResult RptIssuedUnitsCharges()
        {
            return View();
        }
        public ActionResult RptSeroPositive()
        {
            return View();
        }
        public ActionResult RptIPCrossmatch()
        {
            return View();
        }        
        public ActionResult RptPendingReservation()
        {
            return View();
        }
        public ActionResult RptBloodIssue()
        {
            return View();
        }
        public ActionResult RptBloodDiscard()
        {
            return View();
        }        
        public ActionResult RptBloodReturn()
        {
            return View();
        }
        public ActionResult RptOutsideBloodCollection()
        {
            return View();
        }
        public ActionResult RptOutsideBloodIssue()
        {
            return View();
        }
        public ActionResult RptInpatientWiseReplacement()
        {
            return View();
        }
        public ActionResult RptBloodComponentPreparationDetails()
        {
            return View();
        }
        public ActionResult RptBagHistory()
        {
            return View();
        }
        public ActionResult RptMasterReportBloodComponents()
        {
            return View();
        }
        public ActionResult RptTransfusionFeedback()
        {
            return View();
        }
        
        


        #region select2

        public ActionResult Select2RptDoctors(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptDoctorsRepository list = new Select2RptDoctorsRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2RptBloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptBloodGroupRepository list = new Select2RptBloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2RptBloodGroupWithAll(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptBloodGroupWithAllRepository list = new Select2RptBloodGroupWithAllRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2RptBloodComponent(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptBloodComponentRepository list = new Select2RptBloodComponentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2RptIssueHospital(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptIssueHospitalRepository list = new Select2RptIssueHospitalRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2RptInpatient(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptInpatientRepository list = new Select2RptInpatientRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2RptComponent(string searchTerm, int pageSize, int pageNum)
        {
            Select2RptComponentRepository list = new Select2RptComponentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        

        #endregion






    }



    public class Select2RptDoctorsRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptDoctorsRepository$";

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

        public Select2RptDoctorsRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptDoctors");

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
    public class Select2RptBloodGroupRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptBloodGroupRepository$";

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

        public Select2RptBloodGroupRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptBloodGroup");

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
    public class Select2RptBloodGroupWithAllRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptBloodGroupWithAllRepository$";

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

        public Select2RptBloodGroupWithAllRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptBloodGroupWithAll");

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
    public class Select2RptBloodComponentRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptBloodComponentRepository$";

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

        public Select2RptBloodComponentRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptBloodComponent");

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
    public class Select2RptIssueHospitalRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptIssueHospitalRepository$";

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

        public Select2RptIssueHospitalRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptIssueHospital");

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
    public class Select2RptInpatientRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptInpatientRepository$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<InpatientIdName> queryable { get; set; }

        private static IList<InpatientIdName> toIList;
        public IList<InpatientIdName> ToIList
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

        public Select2RptInpatientRepository()
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
        public IQueryable<InpatientIdName> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<InpatientIdName>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptInpatient");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<InpatientIdName> results = dt.ToList<InpatientIdName>();

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
        private IQueryable<InpatientIdName> GetQuery(string searchTerm)
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
        public List<InpatientIdName> Get(string searchTerm, int pageSize, int pageNum)
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
            List<InpatientIdName> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name, m.RegistrationNo
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
    public class Select2RptComponentRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2RptComponentRepository$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<ComponentIdName> queryable { get; set; }

        private static IList<ComponentIdName> toIList;
        public IList<ComponentIdName> ToIList
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

        public Select2RptComponentRepository()
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
        public IQueryable<ComponentIdName> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<ComponentIdName>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2RptComponent");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<ComponentIdName> results = dt.ToList<ComponentIdName>();

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
        private IQueryable<ComponentIdName> GetQuery(string searchTerm)
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
        public List<ComponentIdName> Get(string searchTerm, int pageSize, int pageNum)
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
            List<ComponentIdName> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name,
                list = new object[] {
                    m.id.ToString(), m.name, m.TempId
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


    public class InpatientIdName : IdName
    {
        public string RegistrationNo { get; set; }
    }
    public class ComponentIdName : IdName
    {
        public string TempId { get; set; }
    }


}
