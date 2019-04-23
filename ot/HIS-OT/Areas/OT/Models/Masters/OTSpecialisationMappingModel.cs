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

namespace HIS_OT.Areas.OT.Models
{
    public class OTSpecialisationMappingModel
    {
        public string ErrorMessage { get; set; }

        public List<MainListOTSpecialisation> List()
        {
            DBHelper db = new DBHelper();
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.MainListOTSpecialisation");

            List<MainListOTSpecialisation> list = new List<MainListOTSpecialisation>();
            if (dt.Rows.Count > 0) list = dt.ToList<MainListOTSpecialisation>();
            return list;

        }
        public List<OTNo> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@otnoid", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetSelectOTSpecialisationMapping");
            List<OTNo> list = new List<OTNo>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<OTNo>();
                list[0].Specialisation = this.GetSelectedSpecialisation(id);
            }

            return list;
        }

        public bool Save(OTNo entry)
        {
            try
            {
                List<OTNo> OTNo = new List<Models.OTNo>();
                OTNo.Add(entry);

                List<OTSpecialisation> OTSpecialisation = entry.OTSpecialisation;
                if (OTSpecialisation == null) OTSpecialisation = new List<OTSpecialisation>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlOTNo",OTNo.ListToXml("OTNo")),
                    new SqlParameter("@xmlOTSpecialisation",OTSpecialisation.ListToXml("OTSpecialisation"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("OT.OTSpecializationMappingSave");
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





        private List<Specialisation> GetSelectedSpecialisation(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@otnoid", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetSelectedSpecialisation");
            List<Specialisation> list = new List<Specialisation>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<Specialisation>();

            }

            return list;
        }




    }




    #region Entity

    public class MainListOTSpecialisation
    {
        public int id { get; set; }
        public int ctr { get; set; }
        public string name { get; set; }
        public string Specialization { get; set; }
        public int stationid { get; set; }
        public string StationName { get; set; }
    }

    public class OTNo
    {
        public int Action { get; set; }
        public int ID { get; set; }
        public string Name { get; set; }
        public int OTTypeID { get; set; }
        public string StartDateTime { get; set; }
        public bool Deleted { get; set; }
        public string EndDateTime { get; set; }
        public int stationid { get; set; }
        public int Type { get; set; }

        public string StationName { get; set; }
        public List<OTSpecialisation> OTSpecialisation { get; set; }
        public List<Specialisation> Specialisation { get; set; }
    }
    public class OTSpecialisation
    {
        public int OTid { get; set; }
        public int Specialisationid { get; set; }
        public string Startdatetime { get; set; }
        public bool deleted { get; set; }
    }
    public class Specialisation
    {
        public int ID { get; set; }
        public int ctr { get; set; }
        public int chk { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public bool Deleted { get; set; }
        public int OperatorID { get; set; }
    }

    #endregion

    #region Select2

    public class Select2OTSpecializationMappingStationRepository
    {
        #region INSTRUCTION: Alter the cache key.

        // 1.   Naming convention for the class name is PascalCase.
        //      example: const string CACHE_KEY = "CacheKey";
        const string CACHE_KEY = "#Select2OTSpecializationMappingStationRepository#";

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

        public Select2OTSpecializationMappingStationRepository()
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
            //    new SqlParameter("@departmentid", departmentid)
            //};
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2OTSpecializationMappingStation");

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