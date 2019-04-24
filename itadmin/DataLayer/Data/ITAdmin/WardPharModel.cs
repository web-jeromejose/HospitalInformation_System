using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class WardPharModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(ListWardSaveModel entry)
        {

            try
            {
                List<ListWardSaveModel> ListWardSaveModel = new List<ListWardSaveModel>();
                ListWardSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlListWardSaveModel",ListWardSaveModel.ListToXml("ListWardSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WardPharmacy_Save_SCS");
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


        public List<ListWardModel> WardListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 ID as id,Name text,Name as name from Station where Deleted = 0  and name like '%" + id + "%' ").DataTableToList<ListWardModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListWardModel> WardPharmacyListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 ID as id,Name text,Name as name from Station  where Deleted = 0  and StationTypeID=8  and name like '%" + id + "%' ").DataTableToList<ListWardModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListWardPharViewModel> ListWardPharViewModel(int WardStationId)
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

        public class ListWardSaveModel 
        {
            public int Action { get; set; }
            public int WardStationID { get; set; }
            public int PharmacyStationID { get; set; }
    
        }

        
           public class ListWardModel
           {
               public string id { get; set; }
               public string text { get; set; }
               public string name { get; set; }
           }

           public class ListWardPharViewModel
           {

               public string PharmacyStationID { get; set; }
               public string PharmacyStation { get; set; }
           
           }


    
    }






