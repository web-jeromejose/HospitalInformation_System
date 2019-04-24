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
    public class TransacInvModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();


        public bool Save(ListTransSaveHeaderModel entry)
        {

            try
            {
                List<ListTransSaveHeaderModel> ListTransSaveHeaderModel = new List<ListTransSaveHeaderModel>();
                ListTransSaveHeaderModel.Add(entry);

                List<ListTransSaveDetailsModel> ListTransSaveDetailsModel = entry.ListTransSaveDetailsModel;
                if (ListTransSaveDetailsModel == null) ListTransSaveDetailsModel = new List<ListTransSaveDetailsModel>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlListTransSaveHeaderModel",ListTransSaveHeaderModel.ListToXml("ListTransSaveHeaderModel")),
                    new SqlParameter("@xmlListTransSaveDetailsModel", ListTransSaveDetailsModel.ListToXml("ListTransSaveDetailsModel")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.TransactionInventorySave_SCS");
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

        public List<TransactionInvDashBoardModel> TransactionInvDashBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.TransactionInv_DashBoard_SCS");
            List<TransactionInvDashBoardModel> list = new List<TransactionInvDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<TransactionInvDashBoardModel>();
            return list;
        }

        public List<TransactionInvDashBoardModel> TransactionView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
        
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.TransactionInv_View_SCS");
            List<TransactionInvDashBoardModel> list = new List<TransactionInvDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<TransactionInvDashBoardModel>();
            return list;
        }


        public List<ListTransaInvModel> StationListInV(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,Name as text, Name as name from station where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListTransaInvModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


    }

            public class TransactionInvDashBoardModel
            {
                public int selected { get; set; }
                public int Id { get; set; }
                public string Name { get; set; }
                public int maxId { get; set; }
                public int stationid { get; set; }
    
            }
        

            public class ListTransaInvModel
            {
                public string id { get; set; }
                public string text { get; set; }
                public string name { get; set; }

            }


            public class ListTransSaveHeaderModel
            {
                public int Action { get; set; }
                public int StationId { get; set; }
               public List<ListTransSaveDetailsModel> ListTransSaveDetailsModel { get; set; }
            }
         
            public class ListTransSaveDetailsModel
            {
                public int Id { get; set; }
                public int maxId { get; set; }
                public int stationid { get; set; }
            
            }

}



