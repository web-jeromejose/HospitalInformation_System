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
    public class OtherProcedureModel
    {
        public string ErrorMessage { get; set; }

        public List<OtherProceduresOrder> ShowList(MyFilterOtherProcedure filter)
        {
            List<MyFilterOtherProcedure> f = new List<MyFilterOtherProcedure>();
            f.Add(filter);
            string xml = f.ListToXml("filter");
            int Id = f[0].ID;
            f = null;

            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@filter", xml)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.OtherProcedureList");
            List<OtherProceduresOrder> list = new List<OtherProceduresOrder>();
            if (dt.Rows.Count > 0) list = dt.ToList<OtherProceduresOrder>();
            if (Id != -1 && dt.Rows.Count > 0)
            {
                list[0].OtherProceduresOrderDetail = this.GetOtherProceduresOrderDetail(Id);
            }

            return list;
        }
        public bool Save(OtherProceduresOrder entry)
        {

            try
            {
                List<OtherProceduresOrder> OtherProceduresOrder = new List<OtherProceduresOrder>();
                OtherProceduresOrder.Add(entry);

                List<OtherProceduresOrderDetail> OtherProceduresOrderDetail = entry.OtherProceduresOrderDetail;
                if (OtherProceduresOrderDetail == null) OtherProceduresOrderDetail = new List<OtherProceduresOrderDetail>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOtherProceduresOrder",OtherProceduresOrder.ListToXml("OtherProceduresOrder")),
                    new SqlParameter("@xmlOtherProceduresOrderDetail",OtherProceduresOrderDetail.ListToXml("OtherProceduresOrderDetail"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("OT.OtherProcedureSave");
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
        
        
        private List<OtherProceduresOrderDetail> GetOtherProceduresOrderDetail(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.SelectedOtherProcedures");
            List<OtherProceduresOrderDetail> list = new List<OtherProceduresOrderDetail>();
            if (dt.Rows.Count > 0) list = dt.ToList<OtherProceduresOrderDetail>();
            return list;
        }


    }



    public class OtherProceduresOrder
    {
        public int Action { get; set; }
        public int ID { get; set; }
        public int W { get; set; }
        public int IPID { get; set; }
        public int BedID { get; set; }
        public int StationID { get; set; }
        public int DoctorID { get; set; }
        public int stationslno { get; set; }
        public int TransDoneFromStationID { get; set; }
        public string TransDatetime { get; set; }
        public int OperatorID { get; set; }
        public string DateTime { get; set; }
        public int IsInvDone { get; set; }

        public string PIN { get; set; }
        public string BedNo { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public int GenderId { get; set; }
        public string Gender { get; set; }
        public string BloodGroup { get; set; }
        public string DoctorIdName { get; set; }
        public string OperatorName { get; set; }
        public string OrderNo { get; set; }
        public int Is24 { get; set; }

        public int CurrentStationID { get; set; } 
        public List<OtherProceduresOrderDetail> OtherProceduresOrderDetail { get; set; }
    }
    public class OtherProceduresOrderDetail
    {
        public int OrderID { get; set; }
        public int ServiceID { get; set; }
        public int Quantity { get; set; }
        public int IsInvDone { get; set; }

        public string Name { get; set; }
        public int No { get; set; }

    }
    public class OtherProcedures
    {
        public int ID { get; set; }
        public int DepartmentID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal CostPrice { get; set; }
        public string Remarks { get; set; }
        public string Instructions { get; set; }
        public bool ConType { get; set; }
        public string ArabicName { get; set; }
        public string ArabicCode { get; set; }
        public int SpecialisationId { get; set; }
        public int StatusType { get; set; }
        public int OperatorID { get; set; }
        public string StartDateTime { get; set; }
        public string ModifiedDateTime { get; set; }
        public int ModifiedBy { get; set; }
        public bool Deleted { get; set; }
        public string EndDateTime { get; set; }
        public int UPLOADED { get; set; }
        public string UDATETIME { get; set; }
    }

    public class MyFilterOtherProcedure
    {
        public string FromDateF { get; set; }
        public string FromDateT { get; set; }
        public int PIN { get; set; }
        public int ID { get; set; }
        public int LastPrevDays { get; set; }
        public int StationID { get; set; }
        public int CurrentStationID { get; set; }
    }



    public class Select2GetOtherProceduresRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "$Select2GetOtherProcedures$";

        #endregion

        #region INSTRUCTION: Create IQueryable.

        // 1.   Provide the type of data in the datasource for IQueryable<>. 
        // 2.   The parameter for IQueryable is the business object class you've created above.
        //      example:
        //          public IQueryable<SurgeryDepartment> queryable { get; set; } 
        public IQueryable<OtherProcedures> queryable { get; set; }

        private static IList<OtherProcedures> toIList;
        public IList<OtherProcedures> ToIList
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

        public Select2GetOtherProceduresRepository()
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
        public IQueryable<OtherProcedures> Fetch(string searchTerm)
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                #region INSTRUCTION: Alter the cache value.

                // 1.   Provide the type of data in the datasource for IQueryable<>. 
                // 2.   The parameter for IQueryable is the business object class you've created above.
                //      example:
                //          return (IQueryable<SurgeryDepartment>)HttpContext.Current.Cache[CACHE_KEY];
                return (IQueryable<OtherProcedures>)HttpContext.Current.Cache[CACHE_KEY];

                #endregion
            }


            #region INSTRUCTION: Change parameter values for SP.

            DataTable dt = null;
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                 new SqlParameter("@searchTerm", searchTerm)
            };
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2GetOtherProcedures");

            #endregion

            #region INSTRUCTION: Map DataTable results to List.
            //1.    Provide the strongly typed list of object.
            //2.    The parameter for List is the business object class you've created above.
            //      example: 
            //        List<Employee> results = dt.ToList<Employee>();
            //List<IdName> results = dt.AsEnumerable().Select(
            //m => new IdName()
            //{
            //    id = m.Field<int>("id"),
            //    name = m.Field<string>("name"),
            //    type = m.Field<int>("type"),
            //}).ToList();

            List<OtherProcedures> results = dt.ToList<OtherProcedures>();

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
        private IQueryable<OtherProcedures> GetQuery(string searchTerm)
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
        public List<OtherProcedures> Get(string searchTerm, int pageSize, int pageNum)
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
            List<OtherProcedures> list = this.Get(searchTerm, pageSize, pageNum);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.ID.ToString(),
                text = m.Name,
                list = new object[] {
                    m.ID.ToString(), m.Code, m.Name.ToString()
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