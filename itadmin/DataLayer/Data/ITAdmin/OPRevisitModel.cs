using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class OPRevisitModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(OPRevisitSaveModel entry)
        {

            try
            {
                List<OPRevisitSaveModel> OPRevisitSaveModel = new List<OPRevisitSaveModel>();
                OPRevisitSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOPRevisitSaveModel",OPRevisitSaveModel.ListToXml("OPRevisitSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.OPRevisitDays_Save_SCS");
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

        public List<OPRevisitDashBoard> OPRevisitDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OPRevisitDays_DashBoardSCS");
            List<OPRevisitDashBoard> list = new List<OPRevisitDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<OPRevisitDashBoard>();
            return list;
        }

        public List<OPRevisitView> OPRevisitView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OPRevisitDays_View_SCS");
            List<OPRevisitView> list = new List<OPRevisitView>();
            if (dt.Rows.Count > 0) list = dt.ToList<OPRevisitView>();
            return list;
        }

        public List<ListCompModel> CompanyListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where Deleted = 0 and Active = 0  and name like '%" + id + "%' ").DataTableToList<ListCompModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


        public List<Select2Category> Select2CategoryDAl(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name from Category where Deleted = 0 and Active = 0  and name like '%" + id + "%' ").DataTableToList<Select2Category>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


       
         }

    public class OPRevisitSaveModel
    {

        public int Action { get; set; }
        public int CategoryId { get; set; }
        public int CompanyId { get; set; }
        public int NoOfDays { get; set; }
        public int OperatorId { get; set; }
        public string ClientIP { get; set; }
        public int Id { get; set; }

    
    }


            public class OPRevisitDashBoard
            {
                public int SNo {get; set;}
                public string CompanyName {get; set;}
                public string CategoryName { get; set; }
                public int NoOfDays { get; set; }
                public int Id { get; set; }
            }

            public class OPRevisitView
            {
       
                public string CompanyName { get; set; }
                public string CategoryName { get; set; }
                public int NoOfDays { get; set; }
                public int Id { get; set; }
                public int CompanyId { get; set; }
                public int CategoryId { get; set; }

             
            }

            public class Select2Category
            {
                public string id { get; set; }
                public string text { get; set; }
                public string name { get; set; }
            }

    
    }






