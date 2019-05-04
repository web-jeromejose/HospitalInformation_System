using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Web.Security;
using System.Globalization;
using DataLayer;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Models;
using System.IO;

namespace HIS_BloodBank.Controllers
{
    [Authorize]
    public class BaseController : Controller
    {
        public const string CONST_COOKIE_FILTER = "Filterfy";

        private int? _operatorId;
        //private int? _stationId=0;
        private int _departmentId;
        private string _operatorName;
        private int _divisionId;
        private string _issueAuthorityCode="";
        private static int isSet = 0;

        public BaseController()
        {
        }

        public string IssueAuthorityCode { get { return _issueAuthorityCode; } }
        public int OperatorId
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return Convert.ToInt32(d[0].ToString());
            }

            set { _operatorId = value; }
        }
        public int StationId
        {
            get
            {
                //return Convert.ToInt32(Session["stationId"]);
                if (Request.Cookies["HIS_STATION"] != null)
                    //if (HttpContext.cr.Current.Response.Cookies["HIS_STATION"] != null)
                    return Convert.ToInt32(Request.Cookies["HIS_STATION"].Value);
                else
                    return 0;
            }
            set
            {
                //HttpCookie cookie = new HttpCookie("HIS_STATION");
                //cookie.Expires = DateTime.Now.AddDays(-1d);
                //cookie.Value = value.ToString();

                Response.Cookies.Add(new HttpCookie("HIS_STATION", value.ToString()));

                //Session["stationId"] = value; 
            }

        }
        public int DepartmentId
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return Convert.ToInt32(d[4].ToString());
            }

            set { _departmentId = value; }
        }
        public int DivisionId
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return Convert.ToInt32(d[3].ToString());
            }

            set { _divisionId = value; }
        }
        public string OperatorName
        {
            get
            {
                FormsIdentity id = (FormsIdentity)User.Identity;
                FormsAuthenticationTicket ticket = id.Ticket;
                var d = ticket.UserData.Split('|');
                return d[2].ToString();
            }

            set { _operatorName = value; }
        }
        public int IsSet
        {
            get { return isSet; }
            set { isSet = value; }
        }

        [HttpGet]
        public JsonResult SecurityFeature()
        {
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            HISSecurity cs = new HISSecurity();
            cs.UserID = d[0].ToString();
            cs.ModuleID = "13"; // HRONline system
            var li = cs.SecuritryFeatureCS();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetInfo()
        {
            DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@Empid", Empid)
            //};
            DataTable dt = db.ExecuteSPAndReturnDataTable("HRPlus.ServerInfo");

            List<ServerInfo> list = new List<ServerInfo>();
            list = dt.ToList<ServerInfo>();

            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ServerInfo>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult GetListOfStation(int ModuleId)
        {
            List<CurrentStation> list = this.GetCurrentStation(13);
            if (list[0].value.Length > 0) this.StationId = int.Parse(list[0].value);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CurrentStation>() }),
                ContentType = "application/json"
            };
            return result;
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SetCurrentStation(int Value)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@ModuleId", 13), 
                    new SqlParameter("@EmpId", this.OperatorId),
                    new SqlParameter("@Value", Value)
                };
            db.param[0].Direction = ParameterDirection.Output;
            db.ExecuteSP("OT.SetCurrentStation");
            string ErrorMessage = db.param[0].Value.ToString();

            bool status = ErrorMessage.Split('-')[0] == "100";

            if (status) this.StationId = Value; // Set to current station

            return Json(new CustomMessage { Title = "Message...", Message = ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        private List<CurrentStation> GetCurrentStation(int ModuleId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ModuleId", ModuleId),
                new SqlParameter("@EmpId", this.OperatorId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetCurrentStation");
            List<CurrentStation> list = new List<CurrentStation>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<CurrentStation>();
            }
            else
            {
                CurrentStation empty = new CurrentStation();
                empty.label = "";
                empty.value = "";
                list.Add(empty);
            }
            list[0].ListOStations = this.GetStation(13);

            return list;
        }
        private List<LabelValue> GetStation(int ModuleId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ModuleId", ModuleId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetStation");
            List<LabelValue> list = new List<LabelValue>();
            if (dt.Rows.Count > 0) list = dt.ToList<LabelValue>();

            return list;
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SetUserLastAccessed(int DivisionId, int DepartmentId, int StationId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@ModuleId", 13),  // HROnline
                    new SqlParameter("@EmpId", this.OperatorId),
                    new SqlParameter("@DivisionId", DivisionId),
                    new SqlParameter("@DepartmentId", DepartmentId),                    
                    new SqlParameter("@StationId", StationId)                    
                };
            db.param[0].Direction = ParameterDirection.Output;
            db.ExecuteSP("HRPlus.SetUserLastAccessed");
            string ErrorMessage = db.param[0].Value.ToString();

            bool status = ErrorMessage.Split('-')[0] == "100";

            if (status)
            {
                this.IsSet = 11;
                this.DivisionId = DivisionId;
                this.DepartmentId = DepartmentId;
                this.StationId = StationId; // Set to current station
            }

            return Json(new CustomMessage { Title = "Message...", Message = ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        public ActionResult GetUserLastAccessed()
        {
            List<SetupInfo> list = this.GetSetupInfo();
            list[0].IsSet = this.IsSet;
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SetupInfo>() }),
                ContentType = "application/json"
            };
            return result;
        }
        private List<SetupInfo> GetSetupInfo()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ModuleId", 13),
                new SqlParameter("@EmpId", this.OperatorId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("HRPlus.GetUserLastAccessed");
            List<SetupInfo> list = new List<SetupInfo>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<SetupInfo>();
                this.DivisionId = list[0].DivisionId;
                this.DepartmentId = list[0].DepartmentId;
                this.StationId = list[0].StationId;
            }

            return list;
        }

        public ActionResult Select2SetupDivision(string searchTerm, int pageSize, int pageNum)
        {
            Select2SetupDivisionRepository list = new Select2SetupDivisionRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SetupDepartment(string searchTerm, int pageSize, int pageNum)
        {
            Select2SetupDepartmentRepository list = new Select2SetupDepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SetupStation(string searchTerm, int pageSize, int pageNum)
        {
            Select2SetupStationRepository list = new Select2SetupStationRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        /// <summary>
        /// Populate a TreeView with directories, subdirectories, and files
        /// </summary>
        /// <param name="dir">The path of the directory</param>
        /// <param name="node">The "master" node, to populate</param>
        public void PopulateTree(string dir, JsTreeModel node)
        {
            if (node.children == null)
            {
                node.children = new List<JsTreeModel>();
            }
            // get the information of the directory
            DirectoryInfo directory = new DirectoryInfo(dir);
            // loop through each subdirectory
            foreach (DirectoryInfo d in directory.GetDirectories())
            {
                // create a new node
                JsTreeModel t = new JsTreeModel();
                t.attr = new JsTreeAttribute();
                t.attr.id = d.FullName;
                t.data = d.Name.ToString();
                // populate the new node recursively
                PopulateTree(d.FullName, t);
                node.children.Add(t); // add the node to the "master" node
            }
            // loop through each file in the directory, and add these as nodes
            foreach (FileInfo f in directory.GetFiles("*.htm"))
            {
                // create a new node
                JsTreeModel t = new JsTreeModel();
                t.attr = new JsTreeAttribute();
                t.attr.id = f.FullName;
                t.data = f.Name.ToString();
                // add it to the "master"
                node.children.Add(t);
            }
        }

        protected string GetUserIp()
        {
            string ipList = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipList))
            {
                return ipList.Split(',')[0];
            }

            return Request.ServerVariables["REMOTE_ADDR"];
        }

    }

    public class Select2SetupDivisionRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2SetupDivisionRepository$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<Names> queryable { get; set; }

        private static IList<Names> toIList;
        public IList<Names> ToIList
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

        public Select2SetupDivisionRepository()
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
        public IQueryable<Names> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<Names>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("HRPLUS.Select2SetupDivision");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<Names> results = dt.ToList<Names>();

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
        private IQueryable<Names> GetQuery(string searchTerm)
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
        public List<Names> Get(string searchTerm, int pageSize, int pageNum)
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
            List<Names> list = this.Get(searchTerm, pageSize, pageNum);
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
    public class Select2SetupDepartmentRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2SetupDepartmentRepository$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<Names> queryable { get; set; }

        private static IList<Names> toIList;
        public IList<Names> ToIList
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

        public Select2SetupDepartmentRepository()
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
        public IQueryable<Names> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<Names>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("HRPLUS.Select2SetupDepartment");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<Names> results = dt.ToList<Names>();

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
        private IQueryable<Names> GetQuery(string searchTerm)
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
        public List<Names> Get(string searchTerm, int pageSize, int pageNum)
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
            List<Names> list = this.Get(searchTerm, pageSize, pageNum);
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
    public class Select2SetupStationRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2SetupStationRepository$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<Names> queryable { get; set; }

        private static IList<Names> toIList;
        public IList<Names> ToIList
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

        public Select2SetupStationRepository()
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
        public IQueryable<Names> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<Names>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("HRPLUS.Select2SetupStation");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<Names> results = dt.ToList<Names>();

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
        private IQueryable<Names> GetQuery(string searchTerm)
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
        public List<Names> Get(string searchTerm, int pageSize, int pageNum)
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
            List<Names> list = this.Get(searchTerm, pageSize, pageNum);
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


    public class ServerInfo
    {
        public string svr { get; set; }
        public string db { get; set; }
    }
    public class CurrentStation
    {
        public string label { get; set; }
        public string value { get; set; }
        public List<LabelValue> ListOStations { get; set; }
    }
    public class LabelValue
    {
        public string label { get; set; }
        public string value { get; set; }
    }
    public class CustomMessage
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public int ErrorCode { get; set; }
    }
    public class SetupInfo
    {
        public int DivisionId { get; set; }
        public string DivisionName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int StationId { get; set; }
        public string StationName { get; set; }
        public int IsSet { get; set; }
    }
    public class Names
    {
        public int id { get; set; }
        public string name { get; set; }
        public string ApprovalListId { get; set; }
    }

}
