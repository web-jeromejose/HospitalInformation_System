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
using HIS.Controllers;

using Microsoft.Reporting.WebForms;
using System.Security.Permissions;
using System.Security;


namespace HIS_OT.Areas.OT.Controllers.Masters
{
    public class OtHeadMappingController : BaseController
    {
        //
        // GET: /OT/OtHeadMapping/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Select2EmployeeMapping(string searchTerm, int pageSize, int pageNum)
        {
            Select2EmployeeMappingRepository list = new Select2EmployeeMappingRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult MainListOtHead()
        {
            List<MainListOT> list = this.GetMainListOT();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOT>() }),
                ContentType = "application/json"
            };
            return result;
        }
        private List<MainListOT> GetMainListOT()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                //new SqlParameter("@surgeonId", surgeonId),
                //new SqlParameter("@dfrom", dfrom),
                //new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetHeadMapping");
            List<MainListOT> list = dt.ToList<MainListOT>();
            if (list == null) list = new List<MainListOT>();

            return list;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OTHeadmodel entry)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            bool status = model.SaveOTHead(entry);
            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

         [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CheckOTHeadUser(CheckOTHeadUserModel entry)
        {
            OTSchedulerModel model = new OTSchedulerModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.CheckOTHeadUser(entry);
            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        
        //
        //   [HttpGet]
        //public void GetApplicationMenu()
        //{
        //    if (Request.Cookies["MenuModel"] == null)
        //    {
        //        ApplicationGlobal app = new ApplicationGlobal();
        //        ApplicationVersionModel model = app.GetApplicationDetail();
        //        ControllerContext.StoreModelToCookies("MenuModel", model);
        //    }
        //    else
        //    {
        //        var d = JsonConvert.DeserializeObject<ApplicationVersionModel>(Request.Cookies["AppModel"].Value);
        //        _version =  d.MajorVersion + "." + d.MinorVersion;
        //    }



    }



    #region select2
  
    public class Select2EmployeeMappingRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "#Select2EmployeeMappingRepository#";

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

        public Select2EmployeeMappingRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2EmployeeMapping");

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
