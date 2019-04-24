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

   

    public class HealthCheckupModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool ComputeItemPrice(ComputeItemHeaderPrice entry)
        {

            try
            {
                List<ComputeItemHeaderPrice> ComputeItemHeaderPrice = new List<ComputeItemHeaderPrice>();
                ComputeItemHeaderPrice.Add(entry);

                List<ComputeItemDetailsPrice> ComputeItemDetailsPrice = entry.ComputeItemDetailsPrice;
                if (ComputeItemDetailsPrice == null) ComputeItemDetailsPrice = new List<ComputeItemDetailsPrice>();


                List<ComputeItemDepartConsult> ComputeItemDepartConsult = entry.ComputeItemDepartConsult;
                if (ComputeItemDepartConsult == null) ComputeItemDepartConsult = new List<ComputeItemDepartConsult>();


                List<ComputeHealthProcedure> ComputeHealthProcedure = entry.ComputeHealthProcedure;
                if (ComputeHealthProcedure == null) ComputeHealthProcedure = new List<ComputeHealthProcedure>();
                
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlComputeItemHeader",ComputeItemHeaderPrice.ListToXml("ComputeItemHeader")),
                    new SqlParameter("@xmlComputeItemDetails", ComputeItemDetailsPrice.ListToXml("ComputeItemDetails")),
                    new SqlParameter("@xmlComputeItemDepartConsult", ComputeItemDepartConsult.ListToXml("ComputeItemDepartConsult")),
                    new SqlParameter("@xmlComputeHealthProcedure", ComputeHealthProcedure.ListToXml("ComputeHealthProcedure")), 
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ComputeItemPrice_SCS");
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


        public bool Save(HealthCheckUpHeaderSave entry)
        {

            try
            {
                List<HealthCheckUpHeaderSave> HealthCheckUpHeaderSave = new List<HealthCheckUpHeaderSave>();
                HealthCheckUpHeaderSave.Add(entry);

                List<HealthInvestigationDetailsSave> HealthInvestigationDetailsSave = entry.HealthInvestigationDetailsSave;
                if (HealthInvestigationDetailsSave == null) HealthInvestigationDetailsSave = new List<HealthInvestigationDetailsSave>();


                List<ComputeConsultationDepartmentSave> ComputeConsultationDepartmentSave = entry.ComputeConsultationDepartmentSave;
                if (ComputeConsultationDepartmentSave == null) ComputeConsultationDepartmentSave = new List<ComputeConsultationDepartmentSave>();


                List<ComputeHealthProcedureSave> ComputeHealthProcedureSave = entry.ComputeHealthProcedureSave;
                if (ComputeHealthProcedureSave == null) ComputeHealthProcedureSave = new List<ComputeHealthProcedureSave>();



                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlHealthCheckUpHeaderSave",HealthCheckUpHeaderSave.ListToXml("HealthCheckUpHeaderSave")),
                    new SqlParameter("@xmlHealthInvestigationDetailsSave", HealthInvestigationDetailsSave.ListToXml("HealthInvestigationDetailsSave")),
                    new SqlParameter("@xmlHealthConsulDepart", ComputeConsultationDepartmentSave.ListToXml("ComputeConsultationDepartmentSave")),
                    new SqlParameter("@xmlHealthCheckupProcedures", ComputeHealthProcedureSave.ListToXml("ComputeHealthProcedureSave")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.HealthCheckUpSave_SCS");
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

        public List<HealthCheckupDashBoardModel> HealthCheckupDashBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_DashBoard_SCS");
            List<HealthCheckupDashBoardModel> list = new List<HealthCheckupDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<HealthCheckupDashBoardModel>();
            return list;
        }


        public List<InvestigationTempDisplay> InvestigationTempDisplay()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_InvestigationWithPriceTempDisplay_SCS");
            List<InvestigationTempDisplay> list = new List<InvestigationTempDisplay>();
            if (dt.Rows.Count > 0) list = dt.ToList<InvestigationTempDisplay>();
            return list;
        }

        public List<ConsulDepartTempDisplay> ConsulDepartTempDisplay()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_ConsulatationDeptListWithPriceTemp_SCS");
            List<ConsulDepartTempDisplay> list = new List<ConsulDepartTempDisplay>();
            if (dt.Rows.Count > 0) list = dt.ToList<ConsulDepartTempDisplay>();
            return list;
        }

        public List<HealthProcedureTempDisplay> HealthProcedureTempDisplay()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_OtherProcedureWithPriceTemp_SCS");
            List<HealthProcedureTempDisplay> list = new List<HealthProcedureTempDisplay>();
            if (dt.Rows.Count > 0) list = dt.ToList<HealthProcedureTempDisplay>();
            return list;
        }


        public List<InvestigationList> InvestigationList()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_InvestigationList_SCS");
            List<InvestigationList> list = new List<InvestigationList>();
            if (dt.Rows.Count > 0) list = dt.ToList<InvestigationList>();
            return list;
        }


        public List<FetchHealthCheckupDetails> FetchHealthCheckupDetails(int HealthCheckId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@HealthCheckId", HealthCheckId)
          
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_FetchDetails_SCS");

            List<FetchHealthCheckupDetails> list = new List<FetchHealthCheckupDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<FetchHealthCheckupDetails>();
            if (HealthCheckId != -1 && dt.Rows.Count > 0)
            {
                list[0].InvestigationList = this.InvestigationListWithPrice(HealthCheckId);
                list[0].ConsultationDept = this.ConsultationDeptWithPrice(HealthCheckId);
                list[0].OtherProceduresList = this.OtherProcedureDeptWithPrice(HealthCheckId);


            }

            return list;

        }


        public List<InvestigationList> InvestigationListWithPrice(int HealthCheckId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@HealthCheckId", HealthCheckId),
 

            };


            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_InvestigationWithPrice_SCS");
            List<InvestigationList> list = new List<InvestigationList>();
            if (dt.Rows.Count > 0) list = dt.ToList<InvestigationList>();
            return list;
        }

        public List<ConsultationDept> ConsultationDeptWithPrice(int HealthCheckId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@HealthCheckId", HealthCheckId)
        
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_ConsulatationDeptListWithPrice_SCS");
            List<ConsultationDept> list = new List<ConsultationDept>();
            if (dt.Rows.Count > 0) list = dt.ToList<ConsultationDept>();
            return list;
        }

        public List<OtherProceduresList> OtherProcedureDeptWithPrice(int HealthCheckId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@HealthCheckId", HealthCheckId)
        
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_OtherProcedureWithPrice_SCS");
            List<OtherProceduresList> list = new List<OtherProceduresList>();
            if (dt.Rows.Count > 0) list = dt.ToList<OtherProceduresList>();
            return list;
        }

        public List<ConsultationDept> ConsultationDept()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_ConsulatationDeptList_SCS");
            List<ConsultationDept> list = new List<ConsultationDept>();
            if (dt.Rows.Count > 0) list = dt.ToList<ConsultationDept>();
            return list;
        }

        public List<OtherProceduresList> OtherProceduresList()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HealthCheckUp_OtherProcedureList_SCS");
            List<OtherProceduresList> list = new List<OtherProceduresList>();
            if (dt.Rows.Count > 0) list = dt.ToList<OtherProceduresList>();
            return list;
        }

        public List<ListCompModel> CompanyListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where Deleted = 0 and Active = 0  and name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListDepartModel> DepartListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,DeptCode + ' - ' + Name as text, Name as name from Department where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListDepartModel>();            
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListSampleModel> SampleListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT  a.ID as id,a.Name as name from Sample a where a.Deleted = 0 and name like '%" + id + "%' ").DataTableToList<ListSampleModel>();            
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

       

    }


    public class FetchHealthCheckupDetails
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int companyid { get; set; }
        public string CompanyName { get; set; }
        public string Code { get; set; }
        public string HealthCheckUpName { get; set; }
        public string Date { get; set; }
        public string Amount { get; set; }
        public List<InvestigationList> InvestigationList { get; set; }
        public List<ConsultationDept> ConsultationDept { get; set; }
        public List<OtherProceduresList> OtherProceduresList { get; set; }
    
    
    }



    public class HealthCheckUpHeaderSave
    {
        public int Action { get; set; }
        public int CompanyId { get; set; }
        public string Name  { get; set; }
        public int Deleted { get; set; }
        public int Blocked { get; set; }
        public int OperatorId { get; set; }
        public int DepartmentId { get; set; }
        public string Code { get; set; }
        public decimal Amount { get; set; }
        public int HealthCheckId { get; set; }
        public List<HealthInvestigationDetailsSave> HealthInvestigationDetailsSave { get; set; }
        public List<ComputeConsultationDepartmentSave> ComputeConsultationDepartmentSave { get; set; }
        public List<ComputeHealthProcedureSave> ComputeHealthProcedureSave { get; set; }
    
    }

    public class HealthProcedureTempDisplay 
    {
        public string SNo { get; set; }
        public string ProcedureId { get; set; }
        public string ItemPrice { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CodeName { get; set; }
        public string Sequence { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }
    
    }

    public class ConsulDepartTempDisplay
    {
        public string SNo { get; set; }
        public string DepartmentId { get; set; }
        public string NameCode { get; set; }
        public string Deptname { get; set; }
        public string ItemPrice { get; set; }
        public string Sequence { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }
    }

    public class InvestigationTempDisplay
    {
        public string SNo { get; set; }
        public string testid { get; set; }
        public string ItemPrice { get; set; }
        public string tid { get; set; }
        public string Code { get; set; }
        public string testname { get; set; }
        public string CodeName { get; set; }
        public string stnid { get; set; }
        public string station { get; set; }
        public string sid { get; set; }
        public string sample { get; set; }
        public string seq { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }
        public string HealthCheckUpId { get; set; }
    
    }

    public class ComputeConsultationDepartmentSave
    {
        public int SNo { get; set; }
        public int HCUId { get; set; }
        public string DepartmentId { get; set; }
        public string sequence { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }

    }

    public class ComputeHealthProcedureSave
    {
        public int SNo { get; set; }
        public int HCUId { get; set; }
        public string ProcedureId { get; set; }
        public string sequence { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }

    }

    public class HealthInvestigationDetailsSave 
    {
        public int Id { get; set; }
        public string TestName { get; set; }
        public decimal OriginalPrice {get; set;}
        public decimal Percentage { get; set; }
        public decimal Price { get; set; }
        public int HealthCheckUpId { get; set; }
        public int ServiceId { get; set; }
        public int stationid { get; set; }
        //public int Sequence { get; set; }
        public int SampleId { get; set; }
        public int Sample { get; set; }
        public int testid { get; set; }
  
    
    }

    public class ComputeItemHeaderPrice 
    {
        public int Action { get; set; }
        public decimal Amount { get; set; }
        public List<ComputeItemDetailsPrice> ComputeItemDetailsPrice { get; set; }
        public List<ComputeItemDepartConsult> ComputeItemDepartConsult { get; set; }
        public List<ComputeHealthProcedure> ComputeHealthProcedure { get; set; }
    }

    public class ComputeItemDetailsPrice
    {
        public int Id { get; set; }
        public string TestName { get; set; }
        public string Sample { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal Percentage { get; set; }
        public decimal Price { get; set; }
        public int HealthCheckUpId { get; set; }
        public int testid { get; set; }
        public int tid { get; set; }
        public int stnid { get; set; }
        public string station { get; set; }
        public int sid { get; set; }

    }

    public class ComputeItemDepartConsult
    {
        public int SNo { get; set; }
        public string HCUId { get; set; }
        public string DepartmentId { get; set; }
        public string sequence { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal Percentage { get; set; }
        public decimal Price { get; set; }
    }

    public class ComputeHealthProcedure
    {
        public int SNo { get; set; }
        public int HCUId { get; set; }
        public string ProcedureId { get; set; }
        public string sequence { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal Percentage { get; set; }
        public decimal Price { get; set; }
    }

    public class InvestigationList
    {
        public string SNo { get; set; }
        public string testid { get; set; }
        public string ItemPrice { get; set; }
        public string tid { get; set; }
        public string Code { get; set; }
        public string testname { get; set; }
        public string CodeName { get; set; }
        public string stnid { get; set; }
        public string station { get; set; }
        public string sid { get; set; }
        public string sample { get; set; }
        public string seq { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }
        public string HealthCheckUpId { get; set; }

    }

    public class ConsultationDept
    {
        public string SNo { get; set; }
        public string DepartmentId { get; set; }
        public string NameCode { get; set; }
        public string Deptname { get; set; }
        public string ItemPrice { get; set; }
        public string Sequence { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }
    }

    public class OtherProceduresList
    {
        public string SNo { get; set; }
        public string ProcedureId { get; set; }
        public string ItemPrice { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CodeName { get; set; }
        public string Sequence { get; set; }
        public string OriginalPrice { get; set; }
        public string Percentage { get; set; }
        public string Price { get; set; }
    }

    public class ListCompModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string tariffid { get; set; }
    }

    public class ListDepartModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }



    public class ListSampleModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class HealthCheckupDashBoardModel
    {
        public int SNo { get; set; }
        public string HealthCheckup { get; set; }
        public string CompanyName { get; set; }
        public string StartDateTime { get; set; }
        public int HealthCheckId { get; set; }
        public string Code { get; set; }
        public string DepartmentId { get; set; }
        public string instructions { get; set; }
        public string companyid { get; set; }
        public string EndDateTime { get; set; }
        public int Deleted { get; set; }
        public string Blocked { get; set; }
        public int OperatorID { get; set; }
        public string UPLOADED { get; set; }
        public string CompanyCode { get; set; }
    }

    public class IdName
    {
        public int id { get; set; }
        public string name { get; set; }

    
    }

    public class Select2SampleRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "Select2SampleRepository";

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

        public Select2SampleRepository()
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
            dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Select2_Sample_SCS");

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


    public class Select2PagedResult
    {
        public int Total { get; set; }
        public List<Select2Result> Results { get; set; }
    }

    public class Select2Result
    {
        public string id { get; set; }
        public string text { get; set; }
        public object[] list { get; set; }
    }

    

}



