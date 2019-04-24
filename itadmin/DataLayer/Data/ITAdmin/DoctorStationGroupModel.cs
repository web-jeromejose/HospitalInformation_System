using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;


namespace DataLayer
{
    public class DoctorStationGroupModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        StringBuilder sql = new StringBuilder();

        public List<RoleModel> ProfileList()
        {
            sql.Clear();
            //create table if not exist
            sql.Append("    ");
            sql.Append("   if not  exists(select * from sys.tables where name = 'DoctorStationGroupHeader') ");
            sql.Append("   BEGIN ");
            sql.Append("    ");
            sql.Append("   CREATE TABLE [dbo].[DoctorStationGroupHeader](	 ");
            sql.Append("   [Id] [int] IDENTITY(1,1) NOT NULL, ");
            sql.Append("   [Name] [varchar](50) NULL, ");
            sql.Append("   [DateCreated] [datetime] NULL, ");
            sql.Append("   [OperatorId] [int] NULL, ");
            sql.Append("   [Deleted] [bit] NULL, ");
            sql.Append("   [CreatedIPAddress] [varchar](30) NULL ");
            sql.Append("   ) ON [PRIMARY]	 ");
            sql.Append("    ");
            sql.Append("   END ");
            sql.Append("   if not  exists(select * from sys.tables where name = 'DoctorStationGroupStationDetail') ");
            sql.Append("   BEGIN ");
            sql.Append("   CREATE TABLE [dbo].[DoctorStationGroupStationDetail](	 ");
            sql.Append("   [Id] [int] IDENTITY(1,1) NOT NULL, ");
            sql.Append("   [ProfileId] [int] NULL, ");
            sql.Append("   [StationId] [int] NULL, ");
            sql.Append("   [DateCreated] [datetime] NULL, ");
            sql.Append("   [OperatorId] [int] NULL, ");
            sql.Append("   [Deleted] [bit] NULL, ");
            sql.Append("   [CreatedIPAddress] [varchar](30) NULL ");
            sql.Append("   ) ON [PRIMARY]	 ");
            sql.Append("    ");
            sql.Append("   END ");
            sql.Append("   if not  exists(select * from sys.tables where name = 'DoctorStationGroupDoctorDetail') ");
            sql.Append("   BEGIN	 ");
            sql.Append("   CREATE TABLE [dbo].[DoctorStationGroupDoctorDetail](	 ");
            sql.Append("   [Id] [int] IDENTITY(1,1) NOT NULL, ");
            sql.Append("   [ProfileId] [int] NULL, ");
            sql.Append("   [DoctorId] [int] NULL, ");
            sql.Append("   [DateCreated] [datetime] NULL, ");
            sql.Append("   [OperatorId] [int] NULL, ");
            sql.Append("   [Deleted] [bit] NULL, ");
            sql.Append("   [CreatedIPAddress] [varchar](30) NULL ");
            sql.Append("   ) ON [PRIMARY]	 ");
            sql.Append("   END ");

          

            sql.Append("   select id,name,name as text from DoctorStationGroupHeader where deleted = 0");
            return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<RoleModel>();
        }

        public List<IdName> ShowStationProfileId(int profileid)
        {
            sql.Clear();
            sql.Append("  select a.StationId as id,b.Name as name from  [dbo].[DoctorStationGroupStationDetail] a left join dbo.station b on a.StationId = b.ID where a.Deleted = 0  and a.ProfileId = " + profileid);
            return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<IdName>();
        }
        public List<IdName> ShowDoctorProfileId(int profileid)
        {
            sql.Clear();
            sql.Append("  select a.DoctorId as id,cast(b.EmployeeID as varchar(max)) + '-'+ b.name as name from  [dbo].[DoctorStationGroupDoctorDetail] a left join Doctor b on a.DoctorId = b.ID where a.Deleted = 0  and a.ProfileId = " + profileid);
            return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<IdName>();
        }

        public bool Save(DonorStatGroupSave entry)
        {
            StringBuilder sql = new StringBuilder();
            try
            {
                DBHelper db = new DBHelper();
                sql.Clear();
                if (entry.doctorlist != null)
                {
                    sql.Append("    update [dbo].[DoctorStationGroupDoctorDetail] set deleted = 1 where deleted = 0 and ProfileId = " + entry.profileid);
                       
                    foreach (var componentId in entry.doctorlist)
                    {
                        var doctorid = componentId.id;
                       sql.Append("    insert into [dbo].[DoctorStationGroupDoctorDetail] (ProfileId,DoctorId,DateCreated,OperatorId,Deleted,CreatedIPAddress) values ('" + entry.profileid + "','" + doctorid + "',getdate(),'" + entry.operatorid + "',0,'" + entry.ipaddress + "')  ");
                    }
                }
                if (entry.stationlist != null)
                {
                    sql.Append("    update [dbo].[DoctorStationGroupStationDetail] set deleted = 1 where deleted = 0 and ProfileId = " + entry.profileid);
                       
                    foreach (var componentId in entry.stationlist)
                    {
                        var stationid = componentId.id;
                        sql.Append("    insert into [dbo].[DoctorStationGroupStationDetail] (ProfileId,StationId,DateCreated,OperatorId,Deleted,CreatedIPAddress) values ('" + entry.profileid + "','" + stationid + "',getdate(),'" + entry.operatorid + "',0,'" + entry.ipaddress + "')  ");
                    }
                }
                db.ExecuteSQL(sql.ToString());
                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }


        public bool SaveProfile(SaveProfile entry)
        {
            StringBuilder sql = new StringBuilder();
            try
            {
                DBHelper db = new DBHelper();
                sql.Clear();

                sql.Append(" if not exists (select * from [dbo].[DoctorStationGroupHeader] where  LOWER(LTRIM(RTRIM(name))) =   LOWER(LTRIM(RTRIM('" + entry.newprofile + "'))) )  ");
                sql.Append(" begin ");
                sql.Append("   ");
                sql.Append("  insert into [dbo].[DoctorStationGroupHeader] (Name,DateCreated,OperatorId,Deleted,CreatedIPAddress)");
                sql.Append("  values('" + entry.newprofile + "',getdate(),'" + entry.operatorid + "',0,'" + entry.ipaddress + "') ");                  
                sql.Append("  end ");
                 
                db.ExecuteSQL(sql.ToString());
                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }




    }
    public class SaveProfile
    {
        public string  newprofile { get; set; }
        public int operatorid { get; set; }
        public string ipaddress { get; set; }
   }
    public class DonorStatGroupSave
    {
        public int profileid { get; set; }
        public int operatorid { get; set; }
        public string ipaddress { get; set; }
        public List<DocStatlist> doctorlist { get; set; }
        public List<DocStatlist> stationlist { get; set; }
    }
    public class DocStatlist
    {
        public int id { get; set; }
    }
    #region select2
    public class Select2NewDoctorListRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2NewDoctorListRepository$";

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

        public Select2NewDoctorListRepository()
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
            StringBuilder sql = new StringBuilder();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@divisionId",DivisionId)
            //};

            sql.Append(" select id,cast(EmployeeID as varchar(max)) + '-'+ name as name from doctor where deleted = 0 ");
            dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());

            // dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2DoctorList");

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

    public class Select2NewStationListRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2NewStationListRepository$";

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

        public Select2NewStationListRepository()
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
            StringBuilder sql = new StringBuilder();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@divisionId",DivisionId)
            //};
            sql.Clear();
            sql.Append("  select id,name from  station where deleted = 0 ");
            dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());

            // dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.Select2DoctorList");

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
