using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class CategoryStationMapModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(ListCategoryStationSaveModel entry)
        {

            try
            {
                List<ListCategoryStationSaveModel> ListCategoryStationSaveModel = new List<ListCategoryStationSaveModel>();
                ListCategoryStationSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlListCategoryStationSaveModel",ListCategoryStationSaveModel.ListToXml("ListCategoryStationSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CategoryStation_Save_SCS");
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

        public List<ListCategoryModel> CategoryListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 ID as id,Name text,Name as name from itemgroup where fixed = 1 and name like '%" + id + "%' ").DataTableToList<ListCategoryModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<Select2StationModel> StationListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 ID as id,Name text,Name as name from Station where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<Select2StationModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListWardPharViewModel> ListWardPharDAL(int WardStationId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@WardStationId", WardStationId),
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.WardPhar_View_SCS");
            List<ListWardPharViewModel> list = new List<ListWardPharViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ListWardPharViewModel>();
            return list;
        }

   
         }

            public class ListCategoryStationSaveModel
            {
                public int Action { get; set; }
                public int categoryid { get; set; }
                public int stationid { get; set; }
    
    
            }
    

        
           public class ListCategoryModel
           {
               public string id { get; set; }
               public string text { get; set; }
               public string name { get; set; }
           }

           public class Select2StationModel
           {
               public string id { get; set; }
               public string text { get; set; }
               public string name { get; set; }
           
           }


    
    }






