using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Data.SqlClient;


namespace DataLayer
{

    public class ReroutingORderModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(ReRouteHeaderSaveModel entry)
        {

            try
            {
                List<ReRouteHeaderSaveModel> ReRouteHeaderSaveModel = new List<ReRouteHeaderSaveModel>();
                ReRouteHeaderSaveModel.Add(entry);

                //List<MarkupCompanyLevelSave> MarkupCompanyLevelSave = entry.MarkupCompanyLevelSave;
                //if (MarkupCompanyLevelSave == null) MarkupCompanyLevelSave = new List<MarkupCompanyLevelSave>();

                List<ReRouteDetailsSaveModel> ReRouteDetailsSaveModel = entry.ReRouteDetailsSaveModel;
                if (ReRouteDetailsSaveModel == null) ReRouteDetailsSaveModel = new List<ReRouteDetailsSaveModel>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReRouteHeaderSaveModel",ReRouteHeaderSaveModel.ListToXml("ReRouteHeaderSaveModel")) ,       
                    new SqlParameter("@xmlReRouteDetailsSaveModel",ReRouteDetailsSaveModel.ListToXml("ReRouteDetailsSaveModel")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ReRouteOrder_SAVE_SCS");
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


        public List<ListPharmacy> Select2Pharmacy(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT ID id,Name as text,Name as name from Station where Deleted = 0 and Name like '%" + id + "%' ").DataTableToList<ListPharmacy>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


        public List<PharmacyViewModel> PharmacyViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
        
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ReRoutingOrders_View_SCS");
            List<PharmacyViewModel> list = new List<PharmacyViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<PharmacyViewModel>();
            return list;
        }

       
       
    }

    public class ReRouteHeaderSaveModel 
    {
        public int Action { get; set; }
        public int PharmacyId { get; set; }
        public List<ReRouteDetailsSaveModel> ReRouteDetailsSaveModel { get; set; }
        
    }

    public class ReRouteDetailsSaveModel
    {
        public int ActivePharmacyStnId { get; set; }
        public DateTime FromTime { get; set; }
        public DateTime ToTime { get; set; }
    
    }

    public class Select2Station
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2Station";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<StationModel> queryable { get; set; }

        private static IList<StationModel> toIList;
        public IList<StationModel> ToIList
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

        public Select2Station()
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
        public IQueryable<StationModel> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<StationModel>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Select2StationList_SCS");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            List<StationModel> results = dt.ToList<StationModel>();

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
        private IQueryable<StationModel> GetQuery(string searchTerm)
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
            return queryable.Where(a => a.Name.Like(searchTerm));

            #endregion
        }

        #endregion

        #region INSTRUCTION: Return only the results we want

        //      INSTRUCTION:
        //1.    Provide the strongly typed list of object.
        //2.    The parameter for List is the business object class you've created above.
        //      example: public List<SurgeryDepartment> Get(string searchTerm, int pageSize, int pageNum)
        public List<StationModel> Get(string searchTerm, int pageSize, int pageNum)
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
            List<StationModel> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.Id.ToString(),
                text = m.Name.ToString(),
                list = new object[] {
                      //m.TaxRate
                     
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

    public class StationModel
    {
      public int Id {get; set;}
      public string Name {get; set;}
    }

    public class ListPharmacy
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }

    public class PharmacyViewModel
    {
        public string Station { get; set; }
        public string FromTime { get; set; }
        public string ToTime { get; set; }
        public int stationid { get; set; }
        public string blank { get; set; }
    
    }


    

}



