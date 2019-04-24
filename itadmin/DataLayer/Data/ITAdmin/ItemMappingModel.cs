using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class ItemMappingModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


            public List<Select2StationModel> StationListDAL(string id)
            {
                return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 ID as id,Name text,Name as name from Station where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<Select2StationModel>();
                //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
            }


            public bool Save(ItemMappingSaveModel entry)
            {

                try
                {
                    List<ItemMappingSaveModel> ItemMappingSaveModel = new List<ItemMappingSaveModel>();
                    ItemMappingSaveModel.Add(entry);


                    DBHelper db = new DBHelper();
                    db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlItemMappingSaveModel",ItemMappingSaveModel.ListToXml("ItemMappingSaveModel"))     
                                     
                };

                    db.param[0].Direction = ParameterDirection.Output;
                    db.ExecuteSP("ITADMIN.ItemMapping_Save_SCS");
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



   
         }

    public class ItemMappingSaveModel
    {
        public int Action { get; set; }
        public int fromstation { get; set; }
        public int tostation { get; set; }
    
    }
         

    

    
    }






